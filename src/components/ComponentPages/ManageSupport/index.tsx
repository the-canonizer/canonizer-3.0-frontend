import React, { useEffect, useRef, useState } from "react";
// import ManageSupportUI from "./ManageSupportUI";
import { message } from "antd";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import dynamic from "next/dynamic";
import {
  getAllUsedNickNames,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
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
import moment from "moment";

const ManageSupportUI = dynamic(async () => await import("./ManageSupportUI"), {
  ssr: false,
});

const ManageSupport = ({
  handleCancelSupportCamps,
  selectNickId: getDelegateId,
  setGetManageSupportLoadingIndicator,
  getManageSupportLoadingIndicator,
  getCheckStatusAPI,
}) => {
  const { asof, asofdate } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state?.filters?.filterObject?.asof,
  }));
  const dispatch = useDispatch();
  const { isUserAuthenticated } = isAuth();
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [topicSupportListData, setTopicSupportListData] = useState([]);
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [campIds, setcampIds] = useState([]);
  const [manageSupportList, setManageSupportList] = useState([]);
  const [manageSupportRevertData, setManageSupportRevertData] = useState([]);
  const [parentSupportDataList, setParentSupportDataList] = useState([]);
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [checked, setChecked] = useState(false);
  const [getSupportStatusData, setGetSupportStatusData] = useState("");
  const [unableToFindCamp, setUnableToFindCamp] = useState<boolean>(false);
  const [updatePostion, setUpdatePostion] = useState<boolean>(false);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  //get NickName List Data
  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res.status_code == 200) {
      setNickNameList(res.data);
    }
  };
  //get Data for CurrentCampName from Api
  const reqBody = {
    topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
    camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
    as_of: asof,
    as_of_date:
      asof == "default" || asof == "review"
        ? Date.now() / 1000
        : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  };
  //Support page Link Url
  const { manageSupportUrlLink } = useSelector((state: RootState) => ({
    manageSupportUrlLink: state.topicDetails.manageSupportUrlLink,
  }));
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
  const campRef = useRef(null);
  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;
  const reqBodyData: any = {
    topic_num: +router?.query?.camp?.[0]?.split("-")[0],
    camp_num: +router?.query?.camp?.[1]?.split("-")[0],
  };
  // const getDelegateId = router.asPath?.substring(
  //   router.asPath.lastIndexOf("_") + 1
  // );

  if (CheckDelegatedOrDirect && getDelegateId)
    reqBodyData.delegated_nick_name_id = getDelegateId;
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  const refSetter = async (reqBody) => {
    let reqBodyCAmpRecord = reqBody;
    reqBodyCAmpRecord.as_of = "default";
    const res = await getCurrentCampRecordApi(reqBodyCAmpRecord);
    campRef.current = res?.campData;
  };

  //prevent user to open this page if camp archive is true
  // useEffect(()=>{
  //   isUserAuthenticated &&
  //   campRecord?.is_archive  &&
  //   router.route == "/support/[...manageSupport]"
  //     ? router.push("/")
  //     : "";
  // },[])
  //isUserAuthenticated
  useEffect(() => {
    (async () => {
      if (isUserAuthenticated) {
        setUpdatePostion(false);
        await refSetter(reqBody);
        if (manageSupportStatusCheck) {
          setGetManageSupportLoadingIndicator(true);
          await getCanonizedNicknameList();
          setGetManageSupportLoadingIndicator(false);

          getActiveSupportTopicList(null, null, campRef.current);
          setSubmitButtonDisable(false);
          dispatch(setManageSupportStatusCheck(false));
        }
        // else {
        GetCheckStatusData(campRef);
        // }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated, reqBodyData.topic_num, campRecord?.camp_name]);
  const GetCheckStatusData = async (campReff: any) => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));
    if (response && response?.status_code === 404) {
      // router?.push(router?.asPath?.replace("support", "topic"));
      handleCancelSupportCamps({ isCallApiStatus: false });
    }
    if (response && response.status_code === 200) {
      if (response.data?.remove_camps)
        setParentSupportDataList(response.data.remove_camps);

      if (!manageSupportStatusCheck || CheckDelegatedOrDirect) {
        response.data.warning;
        response.data.support_flag;
        //Api's call for list
        dispatch(setCheckSupportExistsData({}));
        dispatch(setCheckSupportExistsData(response.data));
        getCanonizedNicknameList();
        if (isUserAuthenticated) {
          getActiveSupportTopicList(
            response.data.warning,
            response.data.support_flag,
            campReff
          );
        }
        setSubmitButtonDisable(false);
      }
      if (manageSupportStatusCheck && response.data.disable_submit) {
        dispatch(setCheckSupportExistsData(response.data));
      }
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
  const removeAllCampNum = manageSupportList.map((obj) => {
    return obj.camp_num;
  });
  const removeAll = (checked, val) => {
    setCardCamp_ID("");
    setChecked(checked);
    const disabeleAllTopic = val.map((obj) => {
      setcampIds(removeAllCampNum);
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
  const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
  const campNum = router?.query?.camp?.at(1)?.split("-")?.at(0);
  //const camp_Name = router?.query?.manageSupport?.at(1)?.split(/-(.*)/s);

  //replace use to - change to space
  // const camp_Name_ = campRecord?.camp_name;
  // const CampName = camp_Name_;
  const campSupportPath = router?.asPath?.replace("/support/", "/topic/");
  const body = { topic_num: topicNum };
  const getActiveSupportTopicList = async (
    warning?: string,
    statusFlag?: number,
    campRecordRef?: any
  ) => {
    const response = await GetActiveSupportTopic(topicNum && body);
    setTopicSupportListData(response?.data);
    const fiterSupportedCamps = response?.data?.filter((val) => {
      return (
        currentGetCheckSupportExistsData.remove_camps?.findIndex(
          (obj) => obj.camp_num == val.camp_num
        ) == -1
      );
    });
    const dataValue = manageSupportStatusCheck
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
      // setParentSupportDataList(supportArrayListData);
      let resultFilterSupportCamp = response.data.filter(
        (values) => values.camp_num == campNum
      );

      if (dataValue !== "" || CheckDelegatedOrDirect) {
        const unavailable_camp =
          dataValue && dataValue.includes("unable to find this camp");

        setUnableToFindCamp(unavailable_camp);
        setSubmitButtonDisable(unavailable_camp ? unavailable_camp : false);
        setGetSupportStatusData(dataValue);
        //if Warning message is show
        if (resultFilterSupportCamp.length == 0) {
          let supportOrderLen =
            fiterSupportedCamps.length + manageSupportArr.length + 1;
          //push data into a array of manageSupportArray
          manageSupportArr.push({
            topic_num: parseInt(topicNum),
            camp_num: parseInt(campNum),
            camp_name: campRef?.current?.camp_name,
            support_order: supportOrderLen,
            link: campSupportPath,
          });
        }
        if (CheckDelegatedOrDirect && resultFilterSupportCamp.length == 0) {
          setManageSupportList(manageSupportArr);
        } else {
          setManageSupportList([
            ...fiterSupportedCamps,
            ...manageSupportArr,
            ...resultFilterSupportCamp,
          ]);
        }

        setManageSupportRevertData(manageSupportArr);
      } else {
        //warning  message is not show
        setGetSupportStatusData("");

        if (resultFilterSupportCamp.length == 0) {
          let supportOrderLen = supportedCampsList.length + 1;
          //push data into a array of manageSupportArray
          if (campRecordRef?.current?.camp_name) {
            supportedCampsList.push({
              topic_num: parseInt(topicNum),
              camp_num: parseInt(campNum),
              camp_name: campRef?.current?.camp_name,
              support_order: supportOrderLen,
              link: campSupportPath,
            });
          } else {
            supportedCampsList.push({
              topic_num: parseInt(topicNum),
              camp_num: parseInt(campNum),
              camp_name: campRef?.current?.camp_name,
              support_order: supportOrderLen,
              link: campSupportPath,
            });
          }
        }
        setManageSupportList(supportedCampsList);
        setManageSupportRevertData(supportedCampsList);
      }
    }
  };
  let manageSupportPath = router?.asPath?.replace("/support/", "/topic/");
  if (manageSupportPath?.lastIndexOf("_") > -1)
    manageSupportPath = manageSupportPath.substring(
      0,
      manageSupportPath.lastIndexOf("_")
    );
  //remove add id for cancel and submit
  // let remove_ = manageSupportPath.lastIndexOf("_");
  // let resDat = manageSupportPath.substring(0, remove_);
  // let manageSupportPathData = CheckDelegatedOrDirect
  //   ? resDat
  //   : manageSupportPath;

  //Cancel Button
  // const cancelManageRoute = () => {
  // let manageSupportPath1 = manageSupportUrlLink?.replace(
  //   "/support/",
  //   "/topic/"
  // );
  // if (manageSupportPath || manageSupportPath1) {
  //   router?.push(
  //     CheckDelegatedOrDirect ? manageSupportPath : manageSupportPath1
  //   );
  // }
  // };

  //Submit NickName Supported Camps
  const submitNickNameSupportCamps = async (reasonData) => {
    setSubmitButtonDisable(true);
    let campIDsArr = [];
    //get support_flag status check from GetCheckSupportExistsData
    let support_flag_Status = supportedCampsStatus.support_flag;

    let topicNumId =
      manageSupportRevertData.length > 0
        ? manageSupportRevertData[0].topic_num
        : router?.query?.camp?.at(0)?.split("-")?.at(0);
    //order Update
    const filteredManageSupportList = manageSupportList.filter((obj) => {
      return !obj.dis;
    });
    const manageListOrder = filteredManageSupportList.length;
    let resultCamp = manageSupportList.filter(
      (values) => !campIds.includes(values.camp_num)
    );
    //if supported camps  flag is 0 means not supported else same as previous
    resultCamp =
      !updatePostion && support_flag_Status == 0
        ? resultCamp.filter((value) => value.camp_num == campNum)
        : resultCamp;
    let filterArrayResult = [];

    //check support Camps is 1 or 0  and update order of camps
    support_flag_Status == 1 || updatePostion
      ? resultCamp.map((data, key) => {
          filterArrayResult.push({
            camp_num: data.camp_num,
            order: key + 1,
          });
        })
      : resultCamp.map((data) => {
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
      //checks for support order add new camps data
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
    let nickNameIDValue = nickNameID[0]?.id;
    let addCampsData;
    if (support_flag_Status == 1) {
      addCampsData = {};
    } else {
      addCampsData = add_camp_data;
    }
    let addSupportId = {
      topic_num: topicNumId,
      add_camp: addCampsData,
      remove_camps: campIDsArr,
      type: "direct",
      action: campIDsArr.length > 0 ? "partial" : "add",
      nick_name_id: nickNameIDValue,
      order_update: filterArrayResult,
    };

    if (campIDsArr.length > 0) {
      addSupportId = { ...addSupportId, ...reasonData };
    }

    //Case if data pass from delegated or direct
    if (CheckDelegatedOrDirect) {
      setGetManageSupportLoadingIndicator(true);

      let nickNameID = nickNameList.filter(
        (values) => selectedtNickname == values.id
      );
      let nickNameIDValue = nickNameID[0]?.id;
      let delegated_user_id = getDelegateId;

      const addDelegatedSupport = {
        nick_name_id: nickNameIDValue,
        delegated_nick_name_id: delegated_user_id,
        topic_num: topicNumId,
      };
      let res = await addDelegateSupportCamps(addDelegatedSupport);
      if (res && res.status_code == 200) {
        message.success(res.message);
        //After Submit page is redirect to previous
        // router?.push(manageSupportPath);
        handleCancelSupportCamps({ isCallApiStatus: true });
      } else {
        setSubmitButtonDisable(false);
      }
    } else {
      let res = await addSupport(addSupportId);
      if (res && res.status_code == 200) {
        message.success(res.message);
        //After Submit page is redirect to previous
        // router?.push(manageSupportPath);
        handleCancelSupportCamps({ isCallApiStatus: false });
      } else {
        setSubmitButtonDisable(false);
      }
    }
    handleCancelSupportCamps({ isCallApiStatus: true });
  };
  return (
    <>
      <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar bg-white">
        {/* <Sidebar /> */}
      </aside>
      <div className="pageContentWrap">
        {/* <CampInfoBar
          isTopicPage={true}
          payload={{
            topic_num: router?.query?.manageSupport?.at(0)?.split("-")?.at(0),
            camp_num:
              router?.query?.manageSupport?.at(1)?.split("-")?.at(0) ?? "1",
          }}
        /> */}
        {campRecord && (
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
            // cancelManageRoute={cancelManageRoute}
            setSelectedtNickname={setSelectedtNickname}
            selectedtNickname={selectedtNickname}
            submitButtonDisable={submitButtonDisable}
            setUpdatePostion={setUpdatePostion}
            unableToFindCamp={unableToFindCamp}
            updatePostion={updatePostion}
            campIds={campIds}
            setcampIds={setcampIds}
            CurrentCheckSupportStatus={CurrentCheckSupportStatus}
            getManageSupportLoadingIndicator={getManageSupportLoadingIndicator}
            setGetManageSupportLoadingIndicator={
              setGetManageSupportLoadingIndicator
            }
            topicSupportListData={topicSupportListData}
            handleCancelSupportCamps={handleCancelSupportCamps}
            getCheckStatusAPI={getCheckStatusAPI}
          />
        )}
      </div>
    </>
  );
};

export default ManageSupport;
