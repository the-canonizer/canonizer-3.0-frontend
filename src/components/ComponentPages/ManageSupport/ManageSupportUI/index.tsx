import React, { useState, useEffect } from "react";
import { Card, Tag, Select, Button, Col, Form } from "antd";
import { DraggableArea } from "react-draggable-tags";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import styles from "../ManageSupportUI/ManageSupport.module.scss";

import messages from "../../../../messages";
import { RootState } from "src/store";
import { addSupport, removeSupportedCamps } from "src/network/api/userApi";
// import { GetActiveSupportTopic } from "src/network/api/topicAPI";
import CustomSkelton from "src/components/common/customSkelton";
import SupportRemovedModal from "src/components/common/supportRemovedModal";
import My404 from "../../404";
import { setIsSupportModal } from "src/store/slices/topicSlice";
import { setOpenConsensusTreePopup } from "src/store/slices/hotTopicSlice";

const { placeholders } = messages;

const ManageSupportUI = ({
  nickNameList,
  manageSupportList,
  removeAll,
  clearAllChanges,
  handleClose,
  checked,
  setManageSupportList,
  parentSupportDataList,
  getSupportStatusData,
  submitNickNameSupportCamps,
  selectedtNickname,
  setSelectedtNickname,
  submitButtonDisable,
  setUpdatePostion,
  unableToFindCamp,
  getManageSupportLoadingIndicator,
  setGetManageSupportLoadingIndicator,
  topicSupportListData,
  handleCancelSupportCamps,
}: any) => {
  const [tagsArrayList, setTagsArrayList] = useState([]);
  const [isTagDragged, setIsTagDragged] = useState(false);
  // const [isSupportTreeCardModal, setIsSupportTreeCardModal] = useState(false);
  // const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  // const [topicSupportList, setTopicSupportList] = useState([]);
  const [removeCampsSupport, setRemoveCampsSupport] = useState(false);

  const {
    currentDelegatedSupportedClick,
    currentGetCheckSupportExistsData,
    campRecord,
  } = useSelector((state: RootState) => ({
    currentDelegatedSupportedClick:
      state.supportTreeCard.currentDelegatedSupportedClick,
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const router = useRouter();
  const dispatch = useDispatch();
  const [removeForm] = Form.useForm();
  // const openPopup = () => setIsSupportTreeCardModal(true);
  const closePopup = () => {};

  const filteredList = manageSupportList?.map((obj: any, index: any) => {
    return {
      camp_num: obj.camp_num,
      order: index + 1, //obj.support_order,
    };
  });

  const filterList = (campNum, position) => {
    const index = filteredList.findIndex((obj) => obj.camp_num === campNum);
    filteredList[index] = {
      camp_num: campNum,
      order: position + 1,
    };
  };

  const removeAllCampNum = () => {
    const filteredList = manageSupportList?.filter((obj: any) => obj.dis);
    return filteredList?.map((obj) => obj.camp_num);
  };

  const removeAllIsSelected = () => {
    const filteredList = manageSupportList?.filter((obj: any) => obj.dis);
    if (filteredList?.length == manageSupportList?.length) return true;
    else false;
  };

  const removeCampFilterdList =
    currentGetCheckSupportExistsData?.remove_camps?.map((obj) => {
      return obj.camp_num;
    });

  const warningForDirecteSupportedCamps =
    "You are directly supporting one or more camps under this topic. If you continue your direct support will be removed.";
  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +router?.query?.camp[1]?.split("-")[0],
  };

  // const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);

  const findManageOrder = filteredList?.findIndex((obj: any) => {
    return obj.camp_num === reqBodyData.camp_num;
  });

  const manageListOrder =
    manageSupportList?.length > 0
      ? findManageOrder > -1
        ? filteredList[findManageOrder].order
        : manageSupportList[manageSupportList.length - 1]?.support_order
      : 1;

  // const body = { topic_num: topicNum };

  const nickNameloop = nickNameList?.filter((nickName) => {
    return selectedtNickname == nickName.id;
  });

  const nickNameIDValue = nickNameloop?.[0]?.id;

  useEffect(() => {
    // (async () => {
    //   const topicList = await GetActiveSupportTopic(topicNum && body);
    //   if (topicList && topicList.status_code == 200) {
    //     setTopicSupportList(topicList.data);
    //   }
    // })();
    setIsTagDragged(false);
  }, []);
  const isFormValid = async () => {
    const isDropdownValid = await removeForm.validateFields([
      "reason",
      "reason_summary",
      "citation_link",
    ]);

    return isDropdownValid;
  };

  const getReasonFormValue = async () => {
    const formValue = await removeForm.getFieldsValue([
      "reason",
      "reason_summary",
      "citation_link",
    ]);

    return formValue;
  };

  const removeCampsApi = async () => {
    const isDropdownValid = await isFormValid();
    const formData = await getReasonFormValue();
    if (isDropdownValid?.errorFields) {
      return;
    }
    setGetManageSupportLoadingIndicator(true);
    const supportedCampsRemove = {
      topic_num: reqBodyData.topic_num,
      remove_camps: removeAllCampNum(),
      type: "direct",
      action: "all",
      nick_name_id: nickNameIDValue,
      order_update: [],
      ...formData,
    };
    // const topicList = await GetActiveSupportTopic(topicNum && body);
    // if (topicList && topicList.status_code == 200) {
    //   setTopicSupportList(topicList.data);
    // }
    const response = await removeSupportedCamps(supportedCampsRemove);
    if (response && response.status_code == 200) {
      // let manageSupportPath = router?.asPath?.replace("/support/", "/topic/");
      // if (manageSupportPath?.lastIndexOf("_") > -1)
      //   manageSupportPath = manageSupportPath.substring(
      //     0,
      //     manageSupportPath?.lastIndexOf("_")
      //   );
      // router?.push(manageSupportPath);
      handleCancelSupportCamps({ isCallApiStatus: true });
    }
  };

  const addRemoveApi = async () => {
    const isDropdownValid = await isFormValid();
    const formData = await getReasonFormValue();
    if (isDropdownValid?.errorFields) {
      return;
    }
    setGetManageSupportLoadingIndicator(true);
    const addSupportId = {
      topic_num: reqBodyData.topic_num,
      add_camp:
        currentGetCheckSupportExistsData.is_confirm == 0
          ? {}
          : {
              camp_num: reqBodyData.camp_num,
              support_order:
                currentGetCheckSupportExistsData.remove_camps?.[0]
                  ?.support_order || manageListOrder,
            },

      remove_camps:
        currentGetCheckSupportExistsData.is_confirm == 1
          ? removeCampFilterdList
          : [],
      type: "direct",
      action: "add",
      nick_name_id: nickNameIDValue,
      order_update:
        filteredList.length > 0
          ? filteredList
          : [
              {
                camp_num: reqBodyData.camp_num,
                order:
                  currentGetCheckSupportExistsData.remove_camps?.[0]
                    ?.support_order || manageListOrder,
              },
            ],
      ...formData,
    };
    let addedRes = await addSupport(addSupportId);
    if (addedRes && addedRes.status_code == 200) {
      // let manageSupportPath = router?.asPath?.replace("/support/", "/topic/");
      // if (manageSupportPath.lastIndexOf("_") > -1)
      //   manageSupportPath = manageSupportPath.substring(
      //     0,
      //     manageSupportPath.lastIndexOf("_")
      //   );
      // router?.push(manageSupportPath);
      handleCancelSupportCamps({ isCallApiStatus: true });
    }
  };

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;
  // const [CheckDelegatedOrDirect, setCheckDelegatedOrDirect] = useState(null);

  useEffect(() => {
    if (nickNameList?.length > 0) {
      setSelectedtNickname(nickNameList[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickNameList]);

  // useEffect(() => {
  //   setCheckDelegatedOrDirect(
  //     currentDelegatedSupportedClick.delegatedSupportClick
  //   );
  // }, [currentDelegatedSupportedClick.delegatedSupportClick]);

  useEffect(() => {
    if (manageSupportList && manageSupportList.length > 0) {
      const newTagList = manageSupportList.map((obj) => {
        obj.id = obj.camp_num;
        return obj;
      });
      if (!isTagDragged && parentSupportDataList.length > 0) {
        let shouldArrayReverse = true;
        newTagList.forEach((element) => {
          if (element.support_order != newTagList.length) {
            shouldArrayReverse = false;
          }
        });
        if (shouldArrayReverse) setTagsArrayList(newTagList.reverse());
        else setTagsArrayList(newTagList);
      } else setTagsArrayList(newTagList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageSupportList, parentSupportDataList]);

  // remove support popup added.

  const onRemoveFinish = () => {
    // setRemoveSupportSpinner(true);
    // if (removeCampsSupport) {
    // submitNickNameSupportCamps(values);
    // } else {
    // removeCampsApi(values);
    // }
    // removeForm.resetFields();
    // setRemoveSupportSpinner(false);
  };

  const handleOnClick = () => {
    // Original logic
    if (
      removeAllIsSelected() &&
      !currentGetCheckSupportExistsData.is_delegator
    ) {
      removeCampsApi();
    } else if (CheckDelegatedOrDirect) {
      checkNickNameSupportCamps();
    } else if (removeCampsSupport) {
      checkNickNameSupportCamps();
    } else {
      addRemoveApi();
    }
  };

  const checkNickNameSupportCamps = async () => {
    const isDropdownValid = await isFormValid();
    const formData = await getReasonFormValue();
    if (isDropdownValid?.errorFields) {
      return;
    }
    submitNickNameSupportCamps(formData);
  };

  // remove support popup added.
  return currentGetCheckSupportExistsData.warning?.includes(
    "You can not submit your support to this camp, as system is unable to find this camp."
  ) ? (
    <My404 />
  ) : getManageSupportLoadingIndicator ? (
    <CustomSkelton
      skeltonFor="manageSupportCard"
      bodyCount={15}
      stylingClass=""
      isButton={true}
    />
  ) : (
    <>
      <div
        className={styles.card_width}
        // title={
        //   <div className={styles.main_card_title}>
        //     {messages.labels.SupportedCamps}
        //   </div>
        // }
      >
        {(CheckDelegatedOrDirect &&
          currentGetCheckSupportExistsData.is_confirm &&
          currentGetCheckSupportExistsData.remove_camps.length < 0) ||
        unableToFindCamp ? (
          <>
            <span data-testId="warning" className={styles.warning}>
              <strong> Warning! </strong>
              {getSupportStatusData || currentGetCheckSupportExistsData.warning}
            </span>
          </>
        ) : (
          <>
            {getSupportStatusData != "" || CheckDelegatedOrDirect ? (
              <>
                {parentSupportDataList != "" ? (
                  <>
                    <span
                      className={styles.warning}
                      id="getSupportStatusDataWarning"
                    >
                      <strong> Warning! </strong>
                      {CheckDelegatedOrDirect &&
                      !currentGetCheckSupportExistsData.is_delegator
                        ? warningForDirecteSupportedCamps
                        : currentGetCheckSupportExistsData.warning}
                    </span>
                    <Col md={12}>
                      {parentSupportDataList?.map((tag) => {
                        return (
                          <Tag
                            data-testid="camp_name"
                            key={tag.camp_num}
                            className={styles.tag_btn}
                            id="tags"
                          >
                            <div>
                              {""}
                              <span className={styles.count}>{""}</span>
                            </div>

                            <a href="#">
                              {tag.support_order} . {tag.camp_name}
                            </a>
                          </Tag>
                        );
                      })}
                    </Col>
                    <div className={styles.hrtag}></div>
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
            <div className={styles.notes}>
              {" "}
              {messages.labels.manageSupportNote}
            </div>
            {!CheckDelegatedOrDirect && topicSupportListData?.length != 0 ? (
              <div>
                <Card className={styles.margin_top} type="inner">
                  <b>
                    {messages.labels.topicSupportText} &quot;{""}
                    {topicSupportListData?.[0]?.title}
                    {""}&quot;
                  </b>
                </Card>
              </div>
            ) : (
              ""
            )}
            {CheckDelegatedOrDirect ? (
              ""
            ) : (
              <div className="mb-4">
                <span id="quickActions" className={styles.quickAction}>
                  Quick Actions:
                  <span className={styles.checkbox}>
                    <input
                      data-testId="checkbox"
                      type="checkbox"
                      checked={checked}
                      onClick={(e) => {
                        removeAll((e.target as any).checked, manageSupportList);
                        setRemoveCampsSupport(!removeCampsSupport);
                      }}
                      onChange={() => {}}
                    ></input>
                  </span>
                  <span className={styles.removeAll}>Remove all</span>
                  <Button
                    id="clearAllChangesBtn"
                    htmlType="button"
                    className={styles.clear_Btn}
                    onClick={() => {
                      clearAllChanges(manageSupportList);
                      setRemoveCampsSupport(false);
                    }}
                  >
                    Clear all changes
                  </Button>
                </span>
              </div>
            )}
            {tagsArrayList.length > 0 && (
              <DraggableArea
                tags={tagsArrayList}
                render={({ tag, index }) => (
                  <div className="">
                    <Button
                      data-testid="tag-btn"
                      key={tag.camp_num}
                      className={styles.tag_btn}
                      disabled={tag.dis}
                    >
                      <div className={styles.btndiv}>
                        {" "}
                        {filterList(tag.camp_num, index)}
                        <span className={styles.count}>
                          {/* {getSupportStatusData == ""
                          ? index + 1
                          : tag.support_order} */}
                          {index + 1}.{" "}
                        </span>
                        <a
                          data-testid="styles_Bluecolor"
                          className={styles.Bluecolor}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = tag.link;
                            dispatch(setIsSupportModal(false));
                          }}
                        >
                          {tag?.camp_name}
                        </a>
                      </div>
                      {CheckDelegatedOrDirect ? (
                        ""
                      ) : (
                        <CloseCircleOutlined
                          data-testid="close"
                          className="closeId"
                          onClick={() => {
                            handleClose(tag, tag.topic_num, tagsArrayList);
                            setRemoveCampsSupport(true);
                          }}
                        />
                      )}
                    </Button>
                  </div>
                )}
                onChange={(tags) => {
                  setIsTagDragged(true);
                  setUpdatePostion(true);
                  setManageSupportList(tags);
                }}
              />
            )}

            {!CheckDelegatedOrDirect && (
              <div data-testid="support-remove-modal">
                <Card className={styles.support_reason} type="inner">
                  <SupportRemovedModal
                    onFinish={onRemoveFinish}
                    handleCancel={closePopup}
                    form={removeForm}
                    isAdd={true}
                    isOrderChange={isTagDragged}
                  />
                </Card>
              </div>
            )}
          </>
        )}
        <div>
          <Card className={styles.margin_top} type="inner">
            <div className={styles.card_heading}>
              <p id="nickNameToSupport">Nickname To Support Above Camps</p>
            </div>
            <Select
              data-testid="select-option"
              placeholder={placeholders.nickName}
              size="large"
              className={styles.dropdown}
              value={selectedtNickname}
              onChange={(value) => {
                setSelectedtNickname(value);
              }}
              showSearch
              optionFilterProp="children"
            >
              {nickNameList?.map((nick) => {
                return (
                  <Select.Option key={nick.id} value={nick.id}>
                    {nick.nick_name}
                  </Select.Option>
                );
              })}
            </Select>
            <div className={styles.Upload_Cancel_Btn}>
              <Button
                id="uploadBtn"
                htmlType="submit"
                className={styles.Upload_Btn}
                onClick={
                  removeAllIsSelected() &&
                  !currentGetCheckSupportExistsData.is_delegator
                    ? removeCampsApi
                    : CheckDelegatedOrDirect
                    ? checkNickNameSupportCamps
                    : removeCampsSupport
                    ? checkNickNameSupportCamps
                    : addRemoveApi
                }
                disabled={
                  submitButtonDisable ||
                  currentGetCheckSupportExistsData.disable_submit ||
                  campRecord.is_archive == 1
                }
              >
                Submit
              </Button>

              <Button
                id="cancelBtn"
                htmlType="button"
                className={styles.cancel_Btn}
                onClick={() => {
                  handleCancelSupportCamps({ isCallApiStatus: false });
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* <Modal
        className={styles.modal_cross}
        title={
          <p id="all_camps_topics" className={styles.modalTitle}>
            You are about to remove your support from the camp:{" "}
            <span>
              &quot;
              <Link
                href={{
                  pathname: `/topic/${topicRecord?.topic_num}-${topicRecord?.topic_name}/${campRecord?.camp_num}-${campRecord?.camp_name}`,
                }}
              >
                <a>{campRecord?.camp_name}</a>.
              </Link>
              &quot;
            </span>{" "}
            You can optionally add a helpful reason, along with a citation link.
          </p>
        }
        open={isSupportTreeCardModal}
        onCancel={closePopup}
        onOk={closePopup}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Spin spinning={removeSupportSpinner} size="small">
          <SupportRemovedModal
            onFinish={onRemoveFinish}
            handleCancel={closePopup}
            form={removeForm}
          />
        </Spin>
      </Modal> */}
    </>
  );
};

export default ManageSupportUI;
