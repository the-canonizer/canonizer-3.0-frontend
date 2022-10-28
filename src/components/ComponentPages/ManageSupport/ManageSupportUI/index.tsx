import React, { useState, useEffect } from "react";
import { Card, Tag, Select, Spin } from "antd";
import messages from "../../../../messages";
import styles from "../ManageSupportUI/ManageSupport.module.scss";
import Link from "next/link";
import { Button, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { DraggableArea } from "react-draggable-tags";
import { placeholders } from "./../../../../messages/placeholder";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import { addSupport, removeSupportedCamps } from "src/network/api/userApi";
import { GetActiveSupportTopic } from "src/network/api/topicAPI";
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
  cancelManageRoute,
  submitNickNameSupportCamps,
  selectedtNickname,
  setSelectedtNickname,
  submitButtonDisable,
  setUpdatePostion,
  unableToFindCamp,
  updatePostion,
  campIds,
  setcampIds,
}) => {
  const { currentDelegatedSupportedClick } = useSelector(
    (state: RootState) => ({
      currentDelegatedSupportedClick:
        state.supportTreeCard.currentDelegatedSupportedClick,
    })
  );
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  const { manageSupportStatusCheck } = useSelector((state: RootState) => ({
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));
  const { currentGetCheckSupportExistsData } = useSelector(
    (state: RootState) => ({
      currentGetCheckSupportExistsData:
        state.topicDetails.currentGetCheckSupportExistsData,
    })
  );
  const [spinner, setSpinner] = useState(false);
  const [topicSupportList, setTopicSupportList] = useState([]);
  const [removeCampsSupport, setRemoveCampsSupport] = useState(false);
  const currentCampRecord = useSelector(
    (state: RootState) => state.topicDetails.currentCampRecord
  );

  const router = useRouter();
  const manageSupportArr = [];
  const filteredList = manageSupportList.map((obj, index) => {
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
    const filteredList = manageSupportList.filter((obj) => obj.dis);
    return filteredList.map((obj) => obj.camp_num);
  };
  const removeAllIsSelected = () => {
    const filteredList = manageSupportList.filter((obj) => obj.dis);
    if (filteredList.length == manageSupportList.length) return true;
    else false;
  };
  const removeCampFilterdList =
    currentGetCheckSupportExistsData?.remove_camps?.map((obj) => {
      return obj.camp_num;
    });
  const manageListOrder =
    manageSupportList.length > 0
      ? manageSupportList[manageSupportList.length - 1].support_order
      : 1;
  const warningForDirecteSupportedCamps =
    "You are directly supporting one or more camps under this topic. If you continue your direct support will be removed.";
  const reqBodyData = {
    topic_num: +router?.query?.manageSupport[0]?.split("-")[0],
    camp_num: +router?.query?.manageSupport[1]?.split("-")[0],
  };
  const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);

  const body = { topic_num: topicNum };

  // let topicSupport;
  // const topicSupportCampNum = topicSupport?.map((obj)=>{
  //   return obj.camp_num
  // })
  useEffect(() => {
    (async () => {
      const topicList = await GetActiveSupportTopic(topicNum && body);
      if (topicList && topicList.status_code == 200) {
        setTopicSupportList(topicList.data);
      }
    })();
  }, []);
  const removeCampsApi = async () => {
    setSpinner(true);
    const supportedCampsRemove = {
      topic_num: reqBodyData.topic_num,
      remove_camps: removeAllCampNum(),
      type: "direct",
      action: "all",
      nick_name_id: nickNameList[0]?.id,
      order_update: [],
    };
    const topicList = await GetActiveSupportTopic(topicNum && body);
    if (topicList && topicList.status_code == 200) {
      setTopicSupportList(topicList.data);
    }
    const response = await removeSupportedCamps(supportedCampsRemove);
    if (response && response.status_code == 200) {
      let manageSupportPath = router.asPath.replace("/support/", "/topic/");
      if (manageSupportPath.lastIndexOf("_") > -1)
        manageSupportPath = manageSupportPath.substring(
          0,
          manageSupportPath.lastIndexOf("_")
        );
      router.push({
        pathname: manageSupportPath,
      });
    }
  };
  const addRemoveApi = async () => {
    setSpinner(true);
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
      nick_name_id: nickNameList[0]?.id,
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
    };
    let addedRes = await addSupport(addSupportId);
    if (addedRes && addedRes.status_code == 200) {
      let manageSupportPath = router.asPath.replace("/support/", "/topic/");
      if (manageSupportPath.lastIndexOf("_") > -1)
        manageSupportPath = manageSupportPath.substring(
          0,
          manageSupportPath.lastIndexOf("_")
        );
      router.push({
        pathname: manageSupportPath,
      });
    }
  };

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;
  useEffect(() => {
    if (nickNameList.length > 0) {
      setSelectedtNickname(nickNameList[0]?.id);
    }
  }, [nickNameList]);
  let tagsArrayList = [];
  {
    manageSupportList && manageSupportList.length > 0
      ? ((tagsArrayList = manageSupportList),
        tagsArrayList.forEach((obj) => {
          obj.id = obj.camp_num;
        }))
      : "";
  }

  return (
    <>
      <Card
        className={styles.card_width}
        title={
          <div className={styles.main_card_title}>
            {messages.labels.SupportedCamps}
          </div>
        }
      >
        {unableToFindCamp ? (
          <>
            <span className={styles.warning}>
              <strong> Warning! </strong>
              {getSupportStatusData}
            </span>
          </>
        ) : (
          <>
            {getSupportStatusData != "" || CheckDelegatedOrDirect ? (
              <>
                {parentSupportDataList != "" ? (
                  <span className={styles.warning}>
                    <strong> Warning! </strong>
                    {getSupportStatusData != ""
                      ? getSupportStatusData
                      : warningForDirecteSupportedCamps}
                  </span>
                ) : (
                  ""
                )}
                <Col md={12}>
                  {parentSupportDataList?.map((tag) => {
                    return (
                      <Tag key={tag.camp_num} className={styles.tag_btn}>
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
            <div className={styles.notes}>
              {" "}
              Note : To change support order of camp, drag & drop the camp box
              on your choice position.
            </div>
            {!CheckDelegatedOrDirect && topicSupportList.length != 0 ? (
              <div>
                <Card className={styles.margin_top} type="inner">
                  <b>
                    Your supporting camp list for topic &quot;{""}
                    {topicRecord?.topic_name}
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
                <span className={styles.quickAction}>
                  Quick Action:
                  <span className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onClick={(e) => {
                        removeAll((e.target as any).checked, manageSupportList);
                        setRemoveCampsSupport(!removeCampsSupport);
                      }}
                    ></input>
                  </span>
                  <span className={styles.removeAll}>Remove all</span>
                  <Button
                    htmlType="button"
                    className={styles.clear_Btn}
                    onClick={(e) => {
                      clearAllChanges(manageSupportList);
                      setRemoveCampsSupport(false);
                    }}
                  >
                    Clear all changes
                  </Button>
                </span>
              </div>
            )}
            <DraggableArea
              tags={tagsArrayList}
              render={({ tag, index }) => (
                <div className="">
                  <Button
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
                      <Link href={tag.link}>
                        <a className={styles.Bluecolor}>{tag.camp_name}</a>
                      </Link>
                    </div>
                    {CheckDelegatedOrDirect ? (
                      ""
                    ) : (
                      <CloseCircleOutlined
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
                setUpdatePostion(true);
                setManageSupportList(tags);
              }}
            />
          </>
        )}
        <div>
          <Card className={styles.margin_top} type="inner">
            <div className={styles.card_heading}>
              <p>Nick Name To Support Above Camps</p>
            </div>
            <Select
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
            <Spin spinning={spinner} size="large">
              <div className={styles.Upload_Cancel_Btn}>
                <Button
                  id="uploadBtn"
                  htmlType="submit"
                  className={styles.Upload_Btn}
                  onClick={
                    removeAllIsSelected() &&
                    !currentGetCheckSupportExistsData.is_delegator
                      ? removeCampsApi
                      : CheckDelegatedOrDirect || removeCampsSupport
                      ? submitNickNameSupportCamps
                      : addRemoveApi
                  }
                  disabled={submitButtonDisable}
                >
                  Submit
                </Button>

                <Button
                  id="cancelBtn"
                  htmlType="button"
                  className={styles.cancel_Btn}
                  onClick={cancelManageRoute}
                >
                  Cancel
                </Button>
              </div>
            </Spin>
          </Card>
        </div>
      </Card>
    </>
  );
};

export default ManageSupportUI;
