import React, { useState, useEffect } from "react";
import {
  getDirectSupportedCampsList,
  removeOrUpdateDirectSupportCamps,
} from "../../../network/api/userApi";
import { message } from "antd";
import dynamic from "next/dynamic";
const DirectSupportedCampsUI = dynamic(
  () => import("./DirectSupportedCampsUI"),
  { ssr: false }
);
//import DirectSupportedCampsUI from "./DirectSupportedCampsUI";

const DirectSupportedCamps = ({ search }: any) => {
  const [directSupportedCampsList, setDirectSupportedCampsList] = useState([]);
  const [directSopportedCampsListRevert, setdirectSopportedCampsListRevert] =
    useState([]);
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);
  const [removeSupportCampsData, setremoveSupportCampsData] = useState({});
  const [removeTopicNumDataId, setRemoveTopicNumDataId] = useState("");
  const [nickNameId, setNickNameId] = useState("");
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
  };
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [campIds, setcampIds] = useState([]);
  const [CardData, setCardData] = useState([]);
  const [revertBack, setRevertBack] = useState([]);
  const [idData, setIdData] = useState("");
  const [statusFlag, setStatusFlag] = useState(true);
  const handleRevertBack = (topicId, camps) => {
    let data = directSopportedCampsListRevert.filter((val) => {
      return val.topic_num == topicId;
    });

    if (data[0].camps.length > 0) {
      let newData = directSupportedCampsList.map((val) => {
        if (val.topic_num == topicId) {
          return { ...val, camps: data[0].camps };
        } else {
          return val;
        }
      });
      setDirectSupportedCampsList(newData);
    }
    camps.map((val) => {
      val.dis = false;
    });
    setcampIds([]);
    setRevertBack(camps);
  };
  const handleCancel = () => {
    setVisible(false);
    setIdData(cardCamp_ID);
    setShowSaveChanges(true);
  };
  const handleOk = (topicId, val) => {
    setShowSaveChanges(true);
    let data = directSupportedCampsList.filter(
      (value) => value.topic_num == cardCamp_ID
    );
    handleRevertBack(cardCamp_ID, data[0].camps);
    Object.keys(val).length === 0
      ? setcampIds([])
      : ((val.dis = true), setcampIds([val.camp_num]));
    setIdData(topicId), setCardCamp_ID(topicId);
    setVisible(false);
  };

  const handleClose = (val, id, data, CampsOrder) => {
    setCardData(CampsOrder.length > 0 ? CampsOrder : data.camps);
    if (cardCamp_ID == "") {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true), setcampIds([val.camp_num]));
      setShowSaveChanges(true);
      setCardCamp_ID(id);
      setIdData(id);
    } else if (cardCamp_ID && cardCamp_ID == id) {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true), setcampIds([...campIds, val.camp_num]));
      setShowSaveChanges(true);
      setCardCamp_ID(id);
    } else if (cardCamp_ID && cardCamp_ID != id) {
      setIdData(id);
      setVisible(true);
    }

    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
  };

  const saveChanges = async () => {
    let resultCamp = CardData.filter(
      (values) => !campIds.includes(values.camp_num)
    );
    let filterArrayResult = [];
    resultCamp.map((data, key) => {
      filterArrayResult.push({
        camp_num: data.camp_num,
        order: key + 1,
      });
    });
    const tagsDeletedId = {
      topic_num: removeTopicNumDataId,
      remove_camps: campIds,
      type: "direct",
      action: "partial",
      nick_name_id: nickNameId,
      order_update: filterArrayResult,
    };
    let res = await removeOrUpdateDirectSupportCamps(tagsDeletedId);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setShowSaveChanges(false);
      setCardCamp_ID("");
      fetchDirectSupportedCampsList();
    }
  };
  const removeCardSupportedCamps = (data) => {
    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
    setIsSupportedCampsModalVisible(true);
    setremoveSupportCampsData(data);
  };
  //remove Entire Card
  const removeSupport = async () => {
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      remove_camps: [],
      type: "direct",
      action: "all",
      nick_name_id: nickNameId,
      order_update: [],
    };
    let res = await removeOrUpdateDirectSupportCamps(removeEntireData);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setIsSupportedCampsModalVisible(false);
      fetchDirectSupportedCampsList();
    }
  };
  const fetchDirectSupportedCampsList = async () => {
    let response = await getDirectSupportedCampsList();
    if (response && response.status_code === 200) {
      {
        response.data.length > 0 ? "" : setStatusFlag(false);
      }
      setDirectSupportedCampsList(response.data);
      setdirectSopportedCampsListRevert(response.data);
    }
  };
  useEffect(() => {}, [statusFlag]);
  //onLoad
  useEffect(() => {
    fetchDirectSupportedCampsList();
  }, []);
  return (
    <DirectSupportedCampsUI
      removeCardSupportedCamps={removeCardSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isSupportedCampsModalVisible={isSupportedCampsModalVisible}
      directSupportedCampsList={directSupportedCampsList}
      setDirectSupportedCampsList={setDirectSupportedCampsList}
      search={search}
      setCardCamp_ID={setCardCamp_ID}
      removeSupport={removeSupport}
      handleClose={handleClose}
      saveChanges={saveChanges}
      showSaveChanges={showSaveChanges}
      setShowSaveChanges={setShowSaveChanges}
      setRevertBack={setRevertBack}
      revertBack={revertBack}
      handleRevertBack={handleRevertBack}
      visible={visible}
      idData={idData}
      handleOk={handleOk}
      handleCancel={handleCancel}
      removeSupportCampsData={removeSupportCampsData}
      statusFlag={statusFlag}
    />
  );
};

export default DirectSupportedCamps;
