import React, { useState, useEffect } from "react";
import { Card, Tag, Select, Button, Col, Form } from "antd";
import { DraggableArea } from "react-draggable-tags";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import styles from "../ManageSupportUI/ManageSupport.module.scss";

import messages from "../../../../messages";
import { RootState, store } from "src/store";
import { addSupport, removeSupportedCamps } from "src/network/api/userApi";
import CustomSkelton from "src/components/common/customSkelton";
import SupportRemovedModal from "src/components/common/supportRemovedModal";
import My404 from "../../404";
import { setIsSupportModal } from "src/store/slices/topicSlice";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import {
  getCurrentCampRecordApi,
  getTopicActivityLogApi,
} from "src/network/api/campDetailApi";

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
  isSubmitRequire,
  setIsSubmitRequire,
}: any) => {
  const [tagsArrayList, setTagsArrayList] = useState([]);
  const [isTagDragged, setIsTagDragged] = useState(false);
  const [removeCampsSupport, setRemoveCampsSupport] = useState(false);

  const {
    currentDelegatedSupportedClick,
    currentGetCheckSupportExistsData,
    campRecord,
    asof,
    asofdate,
  } = useSelector((state: RootState) => ({
    currentDelegatedSupportedClick:
      state.supportTreeCard.currentDelegatedSupportedClick,
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    campRecord: state?.topicDetails?.currentCampRecord,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state?.filters?.filterObject?.asofdate,
  }));

  const router = useRouter();
  const dispatch = useDispatch();
  const [removeForm] = Form.useForm();

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

  const findManageOrder = filteredList?.findIndex((obj: any) => {
    return obj.camp_num === reqBodyData.camp_num;
  });

  const manageListOrder =
    manageSupportList?.length > 0
      ? findManageOrder > -1
        ? filteredList[findManageOrder].order
        : manageSupportList[manageSupportList.length - 1]?.support_order
      : 1;

  const nickNameloop = nickNameList?.filter((nickName) => {
    return selectedtNickname == nickName.id;
  });

  const nickNameIDValue = nickNameloop?.[0]?.id;

  async function getTopicActivityLogCall() {
    let reqBody = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    };
    let res = await getTopicActivityLogApi(reqBody);
    store.dispatch(setCampActivityData(res?.data?.items));
  }

  useEffect(() => {
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

    const response = await removeSupportedCamps(supportedCampsRemove);

    if (response && response.status_code == 200) {
      let reqBody = {
        as_of: asof,
        as_of_date: asofdate,
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +router?.query?.camp[1]?.split("-")[0],
      };

      getCurrentCampRecordApi(reqBody);

      handleCancelSupportCamps({ isCallApiStatus: true });
      getTopicActivityLogCall();
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
      handleCancelSupportCamps({ isCallApiStatus: true });
      getTopicActivityLogCall();
    }
  };

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;

  useEffect(() => {
    if (nickNameList?.length > 0) {
      setSelectedtNickname(nickNameList[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickNameList]);

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

  const onRemoveFinish = () => {};

  const checkNickNameSupportCamps = async () => {
    const isDropdownValid = await isFormValid();
    const formData = await getReasonFormValue();
    if (isDropdownValid?.errorFields) {
      return;
    }
    submitNickNameSupportCamps(formData);
  };

  const isSupportOrderAscending = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].support_order <= arr[i - 1].support_order) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const setSubmitStatus = async () => {
      if (manageSupportList && manageSupportList.length > 0) {
        const isChanged = isSupportOrderAscending(manageSupportList);

        setIsSubmitRequire(!isChanged);
      }
    };

    setSubmitStatus();
  }, [manageSupportList]);

  useEffect(() => {
    const setSubmitStatus = async () => {
      if (removeCampsSupport) {
        setIsSubmitRequire(true);
      } else {
        setIsSubmitRequire(false);
      }
    };

    setSubmitStatus();
  }, [removeCampsSupport]);

  const onKeyUp = async () => {
    const values = await getReasonFormValue();
    if (
      values?.reason ||
      values?.citation_link ||
      (values?.reason_summary && values?.reason === "Custom reason")
    ) {
      setIsSubmitRequire(true);
    } else {
      setIsSubmitRequire(false);
    }
  };

  // remove support popup added.
  if (
    currentGetCheckSupportExistsData.warning?.includes(
      "You can not submit your support to this camp, as system is unable to find this camp."
    )
  ) {
    return <My404 />;
  }

  if (getManageSupportLoadingIndicator) {
    return (
      <CustomSkelton
        skeltonFor="manageSupportCard"
        bodyCount={15}
        stylingClass=""
        isButton={true}
      />
    );
  }

  return (
    <div className={styles.card_width}>
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
            parentSupportDataList != "" ? (
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
            ) : null
          ) : null}

          <div className={styles.notes}>
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
          ) : null}

          {CheckDelegatedOrDirect ? null : (
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
                      {filterList(tag.camp_num, index)}
                      <span className={styles.count}>{index + 1}. </span>
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
                    {CheckDelegatedOrDirect ? null : (
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
                  onKeyUp={onKeyUp}
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
            getPopupContainer={(triggerNode) => {
              return triggerNode.parentNode;
            }}
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
                (!isSubmitRequire &&
                  currentGetCheckSupportExistsData?.support_flag == "1") ||
                submitButtonDisable ||
                currentGetCheckSupportExistsData.disable_submit ||
                campRecord.is_archive == 1
              }
            >
              {currentGetCheckSupportExistsData?.support_flag == "1"
                ? "Update"
                : "Submit"}
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
  );
};

export default ManageSupportUI;
