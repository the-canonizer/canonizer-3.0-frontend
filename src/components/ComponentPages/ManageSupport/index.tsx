import React, { useEffect, useState } from "react";
// import ManageSupportUI from "./ManageSupportUI";
import { Image, message } from "antd";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";
import styles from "./ManageSupportUI/ManageSupport.module.scss";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import dynamic from "next/dynamic";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { useRouter } from "next/router";
import { GetActiveSupportTopic } from "src/network/api/topicAPI";
import { addDelegateSupportCamps, addSupport } from "src/network/api/userApi";
import isAuth from "../../../hooks/isUserAuthenticated";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
const fcm_token = process.env.NEXT_PUBLIC_FCM_API_KEY;
const ManageSupportUI = dynamic(() => import("./ManageSupportUI"), {
  ssr: false,
});

const ManageSupport = () => {
  const isLogin = isAuth();
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [campIds, setcampIds] = useState([]);
  const [manageSupportList, setManageSupportList] = useState([]);
  const [manageSupportRevertData, setManageSupportRevertData] = useState([]);
  const [parentSupportDataList, setParentSupportDataList] = useState([]);
  const [selectedtNickname, setSelectedtNickname] = useState();
  const [checked, setChecked] = useState(false);
  const [getSupportStatusData, setGetSupportStatusData] = useState<any>();
  const [payloadBreadCrumb, setPayloadBreadCrumb] = useState({});
  console.log("fcm token ", process.env.NEXT_PUBLIC_FCM_API_KEY);
  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res.status_code == 200) {
      setNickNameList(res.data);
    }
  };
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const { currentDelegatedSupportedClick } = useSelector(
    (state: RootState) => ({
      currentDelegatedSupportedClick:
        state.supportTreeCard.currentDelegatedSupportedClick,
    })
  );
  const { currentGetCheckSupportExistsData } = useSelector(
    (state: RootState) => ({
      currentGetCheckSupportExistsData:
        state.topicDetails.currentGetCheckSupportExistsData,
    })
  );
  const { CurrentCheckSupportStatus } = useSelector((state: RootState) => ({
    CurrentCheckSupportStatus: state.topicDetails.CurrentCheckSupportStatus,
  }));
  //GetCheckSupportExistsData check support_id is 0 or 1
  let supportedCampsStatus = currentGetCheckSupportExistsData;

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;
  const breadCrumbData = () => {
    setPayloadBreadCrumb({
      camp_num: router?.query?.manageSupport[1].split("-")[0],
      topic_num: router?.query?.manageSupport[0].split("-")[0],
      topic_name: router?.query?.manageSupport[0].split("-").slice(1).join(" "),
    });
  };
  //isLogin
  useEffect(() => {
    if (isLogin) {
      breadCrumbData();
      getCanonizedNicknameList();
      getActiveSupportTopicList();
      setSubmitButtonDisable(false);
    } else {
      router.push("/login");
    }
  }, [isLogin]);

  let manageSupportArr = [],
    supportArrayListData = [],
    supportedCampsList = [];
  //clearAllChanges Functionality
  const clearAllChanges = (val) => {
    setCardCamp_ID("");
    setcampIds([]);
    setChecked(false);
    const ClearDataRes = (
      getSupportStatusData !== "" ? val : manageSupportRevertData
    ).map((obj) => {
      obj.dis = false;
      return obj;
    });
    setManageSupportList(ClearDataRes);
  };
  //removeAll function
  const removeAll = (checked, val) => {
    setCardCamp_ID("");
    setcampIds([]);
    setChecked(checked);
    const disabeleAllTopic = val.map((obj) => {
      obj.dis = checked;
      return obj;
    });
    setManageSupportList(disabeleAllTopic);
  };
  //handleClose function
  const handleClose = (val, id, dataList) => {
    if (cardCamp_ID == "") {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true), setcampIds([val.camp_num]));
      setCardCamp_ID(id);
    } else if (cardCamp_ID && cardCamp_ID == id) {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true), setcampIds([...campIds, val.camp_num]));
      setCardCamp_ID(id);
    }

    const checkedValue = dataList.every((item) => item.dis == true);
    if (checkedValue) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };
  //get data from url
  const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
  const campNum = router?.query?.manageSupport?.at(1)?.split("-")?.at(0);
  const camp_Name = router?.query?.manageSupport?.at(1)?.split(/-(.*)/s);
  //replace use to - change to space
  const camp_Name_ = camp_Name[1].replace("-", " ");
  //split on ?
  const CampNameData = camp_Name_.split("?");
  //after split Data Value
  const CampName = CampNameData[0];
  const body = { topic_num: topicNum };
  const getActiveSupportTopicList = async () => {
    let response = await GetActiveSupportTopic(topicNum && body);
    //get dataValue from CurrentCheckSupportStatus
    const dataValue = CurrentCheckSupportStatus;
    if (response && response.status_code === 200) {
      setCardCamp_ID("");
      response.data?.map((val) => {
        supportArrayListData.push(val);
        supportedCampsList.push(val);
      });
      setParentSupportDataList(supportArrayListData);
      let resultFilterSupportCamp = response.data.filter(
        (values) => values.camp_num == campNum
      );
      if (dataValue) {
        setGetSupportStatusData(dataValue);
        //if Warning message is show
        if (resultFilterSupportCamp.length == 0) {
          let supportOrderLen = manageSupportArr.length + 1;
          //push data into a array of manageSupportArray
          manageSupportArr.push({
            topic_num: parseInt(topicNum),
            camp_num: parseInt(campNum),
            camp_name: CampName,
            support_order: supportOrderLen,
          });
        }
        setManageSupportList(manageSupportArr);
        setManageSupportRevertData(manageSupportArr);
      } else {
        //warning  message is not show
        setGetSupportStatusData("");
        if (resultFilterSupportCamp.length == 0) {
          let supportOrderLen = supportedCampsList.length + 1;
          //push data into a array of manageSupportArray
          supportedCampsList.push({
            topic_num: parseInt(topicNum),
            camp_num: parseInt(campNum),
            camp_name: CampName,
            support_order: supportOrderLen,
          });
        }
        setManageSupportList(supportedCampsList);
        setManageSupportRevertData(supportedCampsList);
      }
    }
  };

  let manageSupportPath = router.asPath.replace("/support/", "/topic/");
  //remove add id for cancel and submit
  let remove_ = manageSupportPath.split("_");
  manageSupportPath = remove_[0];
  //Cancel Button
  const cancelManageRoute = () => {
    router.push({
      pathname: manageSupportPath,
    });
  };

  //Submit NickName Supported Camps
  const submitNickNameSupportCamps = async () => {
    setSubmitButtonDisable(true);
    let campIDsArr = [];
    //get support_flag status check from GetCheckSupportExistsData
    let support_flag_Status = supportedCampsStatus.support_flag;
    let topicNumId =
      manageSupportRevertData.length > 0
        ? manageSupportRevertData[0].topic_num
        : "";
    //order Update
    let resultCamp = manageSupportList.filter(
      (values) => !campIds.includes(values.camp_num)
    );
    //if supported camps  flag is 0 means not supported else same as previous
    resultCamp =
      support_flag_Status == 0
        ? resultCamp.filter((value) => value.camp_num == campNum)
        : resultCamp;

    let filterArrayResult = [];
    resultCamp.map((data, key) => {
      filterArrayResult.push({
        camp_num: data.camp_num,
        order: key + 1,
      });
    });
    let add_camp_data = {};
    if (getSupportStatusData !== "") {
      parentSupportDataList.length > 0 &&
        parentSupportDataList.map((obj) => {
          campIDsArr.push(obj.camp_num);
          return obj;
        }),
        campIds.length > 0 ? campIDsArr.push(...campIds) : "";
      add_camp_data = filterArrayResult
        ? filterArrayResult[0]
          ? {
              camp_num: filterArrayResult[0].camp_num,
              support_order: filterArrayResult[0].order,
            }
          : {}
        : {};
    } else {
      campIDsArr = campIds;
      let filterRes = filterArrayResult.filter(
        (values) => values.camp_num == campNum
      );
      add_camp_data =
        filterRes.length > 0
          ? filterRes[0]
            ? {
                camp_num: filterRes[0].camp_num,
                support_order: filterRes[0].order,
              }
            : {}
          : filterArrayResult
          ? filterArrayResult[0]
            ? {
                camp_num: filterArrayResult[0].camp_num,
                support_order: filterArrayResult[0].order,
              }
            : {}
          : {};
    }

    //using filter for getting nickName id
    let nickNameID = nickNameList.filter(
      (values) => selectedtNickname == values.id
    );
    let nickNameIDValue = nickNameID[0].id;
    let addCampsData;
    if (support_flag_Status == 1) {
      addCampsData = {};
    } else {
      addCampsData = add_camp_data;
    }
    const addSupportId = {
      topic_num: topicNumId,
      add_camp: addCampsData,
      remove_camps: campIDsArr,
      type: "direct",
      action: "add",
      nick_name_id: nickNameIDValue,
      order_update: filterArrayResult,
      fcm_token: fcm_token,
    };

    if (CheckDelegatedOrDirect) {
      let nickNameID = nickNameList.filter(
        (values) => selectedtNickname == values.id
      );
      let nickNameIDValue = nickNameID[0].id;
      let delegated_user_id = router?.query?.manageSupport[1].split("_");

      const addDelegatedSupport = {
        nick_name_id: nickNameIDValue,
        delegated_nick_name_id: delegated_user_id[1],
        topic_num: topicNumId,
      };
      let res = await addDelegateSupportCamps(addDelegatedSupport);
      if (res && res.status_code == 200) {
        message.success(res.message);
        //After Submit page is redirect to previous
        router.push({
          pathname: manageSupportPath,
        });
      } else {
        setSubmitButtonDisable(false);
      }
    } else {
      let res = await addSupport(addSupportId);
      if (res && res.status_code == 200) {
        message.success(res.message);
        //After Submit page is redirect to previous
        router.push({
          pathname: manageSupportPath,
        });
      } else {
        setSubmitButtonDisable(false);
      }
    }
  };
  return (
    <>
      {payloadBreadCrumb && <CampInfoBar payload={payloadBreadCrumb} />}
      <div className={styles.card}>
        <div className={styles.btnsWrap}>
          <CreateNewCampButton />
        </div>
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/left-sidebar-adv1.jpg"}
            width={200}
            height={400}
          />
        </div>
      </div>
      <ManageSupportUI
        nickNameList={nickNameList}
        manageSupportList={manageSupportList}
        clearAllChanges={clearAllChanges}
        removeAll={removeAll}
        handleClose={handleClose}
        checked={checked}
        setManageSupportList={setManageSupportList}
        parentSupportDataList={parentSupportDataList}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
        submitButtonDisable={submitButtonDisable}
      />
    </>
  );
};

export default ManageSupport;
