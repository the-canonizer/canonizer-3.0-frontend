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
import { addSupport } from "src/network/api/userApi";
import isAuth from "../../../hooks/isUserAuthenticated";
import localforage from "localforage";
const ManageSupportUI = dynamic(() => import("./ManageSupportUI"), {
  ssr: false,
});

const ManageSupport = () => {
  const isLogin = isAuth();
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [paramsList, setParamsList] = useState({});
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [campIds, setcampIds] = useState([]);
  const [manageSupportList, setManageSupportList] = useState([]);
  const [manageSupportRevertData, setManageSupportRevertData] = useState([]);
  const [selectedtNickname, setSelectedtNickname] = useState();
  const [checked, setChecked] = useState(false);
  const [getSupportStatusData, setGetSupportStatusData] = useState<any>();
  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res.status_code == 200) {
      setNickNameList(res.data);
      // setParamsList(paramsList)
    }
  };

  useEffect(() => {
    if (isLogin) {
      getCanonizedNicknameList();
      getActiveSupportTopicList();
    } else {
      router.push("/login");
    }
  }, []);

  let AgreementListArr = [
    {
      id: 1,
      camp_num: 1,
      camp_name: "Agreement",
    },
  ];
  let manageSupportArr = [];
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

  const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
  const campNum = router?.query?.manageSupport?.at(1)?.split("-")?.at(0);
  const camp_Name = router?.query?.manageSupport?.at(1)?.split(/-(.*)/s);
  //replace use to - change to space
  const camp_Name_ = camp_Name[1].replace("-", " ");

  const body = { topic_num: topicNum };
  const getActiveSupportTopicList = async () => {
    let response = await GetActiveSupportTopic(topicNum && body);
    const dataValue = localStorage.getItem("GetCheckSupportStatus");
    if (dataValue) {
      setGetSupportStatusData(dataValue);
    } else {
      setGetSupportStatusData("");
    }

    if (response && response.status_code === 200) {
      setCardCamp_ID("");
      response.data?.map((val) => {
        manageSupportArr.push(val);
      });
      let resultFilterSupportCamp = manageSupportArr.filter(
        (values) => values.camp_num == campNum
      );
      //check for campNum id is same or not and Agrreement is not same in url
      if (resultFilterSupportCamp.length == 0 && manageSupportArr.length == 0) {
        let supportOrderLen = manageSupportArr.length + 1;
        //push data into a array of manageSupportArray
        manageSupportArr.push({
          topic_num: parseInt(topicNum),
          camp_num: parseInt(campNum),
          camp_name: camp_Name_,
          support_order: supportOrderLen,
        });
      } else if (
        resultFilterSupportCamp.length == 0 &&
        camp_Name_ != "Agreement"
      ) {
        let supportOrderLen = manageSupportArr.length + 1;
        //push data into a array of manageSupportArray
        manageSupportArr.push({
          topic_num: parseInt(topicNum),
          camp_num: parseInt(campNum),
          camp_name: camp_Name_,
          support_order: supportOrderLen,
        });
      }
      setManageSupportList(
        dataValue !== "" ? AgreementListArr : manageSupportArr
      );
      setManageSupportRevertData(manageSupportArr);
    }
  };

  const manageSupportPath = router.asPath.replace("/support/", "/topic/");
  //Cancel Button
  const cancelManageRoute = () => {
    router.push({
      pathname: manageSupportPath,
    });
  };

  //Submit NickName Supported Camps
  const submitNickNameSupportCamps = async () => {
    let campIDsArr = [];

    let topicNumId =
      manageSupportRevertData.length > 0
        ? manageSupportRevertData[0].topic_num
        : "";
    //order Update
    let resultCamp = manageSupportList.filter(
      (values) => !campIds.includes(values.camp_num)
    );

    let filterArrayResult = [];
    resultCamp.map((data, key) => {
      filterArrayResult.push({
        camp_num: data.camp_num,
        order: key + 1,
      });
    });
    let add_camp_data = {};
    if (getSupportStatusData !== "") {
      manageSupportRevertData.length > 0 &&
        manageSupportRevertData.map((obj) => {
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
      (values) => selectedtNickname == values.nick_name
    );
    let nickNameIDValue = nickNameID[0].id;
    const fcm_token = await localforage.getItem("fcm_token");
    const addSupportId = {
      topic_num: topicNumId,
      add_camp: add_camp_data,
      remove_camps: campIDsArr,
      type: "direct",
      action: "add",
      nick_name_id: nickNameIDValue,
      order_update: filterArrayResult,
      fcm_token
    };

    let res = await addSupport(addSupportId);
    if (res && res.status_code == 200) {
      message.success(res.message);
      //After Submit page is redirect to previous
      router.push({
        pathname: manageSupportPath,
      });
    }
  };
  return (
    <>
      <CampInfoBar isTopicPage={true} />
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
        manageSupportRevertData={manageSupportRevertData}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
      />
    </>
  );
};

export default ManageSupport;
