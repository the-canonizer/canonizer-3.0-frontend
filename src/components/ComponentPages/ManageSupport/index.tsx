import React, { useEffect, useState } from "react";
// import ManageSupportUI from "./ManageSupportUI";
import { Button, Image, message } from "antd";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";
import styles from "./ManageSupportUI/ManageSupport.module.scss";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import dynamic from "next/dynamic";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { useRouter } from "next/router";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import { addDelegateSupportCamps, addSupport } from "src/network/api/userApi";
import isAuth from "../../../hooks/isUserAuthenticated";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import queryParams from "src/utils/queryParams";
import {
  setCheckSupportExistsData,
  setManageSupportStatusCheck,
} from "src/store/slices/campDetailSlice";

const ManageSupportUI = dynamic(() => import("./ManageSupportUI"), {
  ssr: false,
});

const ManageSupport = () => {
  const dispatch = useDispatch();
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
  const [getSupportStatusData, setGetSupportStatusData] = useState("");
  const [supportStatus, setsupportStatus] = useState<number>(0);
  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res.status_code == 200) {
      setNickNameList(res.data);
    }
  };
  const campRoute = () => {
    router.push("/create/topic");
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

  //check Status for call api for checkstatusData
  const { manageSupportStatusCheck } = useSelector((state: RootState) => ({
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));

  //GetCheckSupportExistsData check support_id is 0 or 1
  let supportedCampsStatus = currentGetCheckSupportExistsData;

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;

  const reqBodyData = {
    topic_num: +router?.query?.manageSupport[0]?.split("-")[0],
    camp_num: +router?.query?.manageSupport[1]?.split("-")[0],
  };

  //isLogin
  useEffect(() => {
    if (isLogin) {
      if (manageSupportStatusCheck) {
        //GetCheckStatusData();
        getCanonizedNicknameList();
        getActiveSupportTopicList();
        setSubmitButtonDisable(false);
        dispatch(setManageSupportStatusCheck(false));
      } else {
        GetCheckStatusData();
      }
    } else {
      router.push("/login");
    }
  }, [isLogin, reqBodyData.topic_num]);

  let warningMsg, supportSts;
  const GetCheckStatusData = async () => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));
    if (response && response.status_code === 200) {
      warningMsg = response.data.warning;
      supportSts = response.data.support_flag;
      setsupportStatus(response.data.support_flag);
      //Api's call for list
      dispatch(setCheckSupportExistsData({}));
      dispatch(setCheckSupportExistsData(response.data));
      getCanonizedNicknameList();
      getActiveSupportTopicList(
        response.data.warning,
        response.data.support_flag
      );
      setSubmitButtonDisable(false);
    }
  };

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
    setChecked(checked);
    const disabeleAllTopic = val.map((obj) => {
      setcampIds([obj.camp_num]);
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
  let Camp_len = CampNameData[0].lastIndexOf("_");
  let CampRes = CampNameData[0].substring(0, Camp_len);
  const CampName = CheckDelegatedOrDirect ? CampRes : CampNameData[0];

  const body = { topic_num: topicNum };
  const getActiveSupportTopicList = async (
    warning?: string,
    statusFlag?: number
  ) => {
    let response = await GetActiveSupportTopic(topicNum && body);
    //get dataValue from CurrentCheckSupportStatus

    let dataValue = manageSupportStatusCheck
      ? CurrentCheckSupportStatus
      : warning
      ? warning
      : "";
    // let dataValue = warningMessage;
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

      if (dataValue !== "") {
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
  let remove_ = manageSupportPath.lastIndexOf("_");
  let resDat = manageSupportPath.substring(0, remove_);
  let manageSupportPathData = CheckDelegatedOrDirect
    ? resDat
    : manageSupportPath;

  //Cancel Button
  const cancelManageRoute = () => {
    router.push({
      pathname: manageSupportPathData,
    });
  };

  //Submit NickName Supported Camps
  const submitNickNameSupportCamps = async () => {
    setSubmitButtonDisable(true);
    let campIDsArr = [];
    //get support_flag status check from GetCheckSupportExistsData
    let support_flag_Status = supportedCampsStatus.support_flag;
    // let support_flag_Status = supportStatus;
    let topicNumId =
      manageSupportRevertData.length > 0
        ? manageSupportRevertData[0].topic_num
        : "";
    //order Update
    const manageListOrder = manageSupportList.length;
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
        order: manageListOrder,
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
              support_order: manageListOrder,
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
      <CampInfoBar isTopicPage={true} />
      <div className={styles.card}>
        <div className="leftSideBar_Card p-0 m-0">
          <div className="btnsWrap">
            <Button
              id="createNewTopicBtn"
              size="large"
              className={"btn"}
              onClick={campRoute}
            >
              <i className="icon-topic"></i> Create New Topic
            </Button>
          </div>
        </div>
        {/* <div className={styles.btnsWrap}>
          <CreateNewCampButton />
        </div> */}
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
