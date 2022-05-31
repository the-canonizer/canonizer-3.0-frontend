import React, { useState, useEffect } from "react";
import {
  getDirectSupportedCampsList,
  removeSupportedCampsEntireTopic,
  removeOrUpdateDirectSupportCamps,
} from "../../../network/api/userApi";
import {  message } from "antd";
import DirectSupportedCampsUI from "./DirectSupportedCampsUI";

const DirectSupportedCamps = ({ search }) => {
  const [directSupportedCampsList, setDirectSupportedCampsList] = useState([]);
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);
  const [removeTopicNumDataId, setRemoveTopicNumDataId] = useState("");
  const [nickNameId, setNickNameId] = useState("");
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ConfirmOkRevert, setConfirmOkRevert] = useState(false);
  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
  };
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [CampArrData, setCampArrData] = useState([]);
  const [campIds, setcampIds] = useState([]);
  const [CardData, setCardData] = useState([]);
  const [originalDataArr, setoriginalDataArr] = useState([]);
  const [revertBack, setRevertBack] = useState([]);
  const [idData, setIdData] = useState("");
  const handleRevertBack = (topicId, camps) => {
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
    setConfirmOkRevert(true);
    setShowSaveChanges(true);
    let data = directSupportedCampsList.filter(
      (value) => value.topic_num == cardCamp_ID
    );
    handleRevertBack(cardCamp_ID, data[0].camps);
    setcampIds([val.camp_num]),
      setCampArrData([
        {
          camp_num: val.camp_num,
          order: val.support_order,
        },
      ]),
      setIdData(topicId),
      (val.dis = true),
      setCardCamp_ID(topicId);
    setVisible(false);
  };
  const handleClose = (val, id, data) => {
    setoriginalDataArr(data);
    setCardData(data.camps);

    if (cardCamp_ID == "") {
      val.dis = true;
      setShowSaveChanges(true);
      setCardCamp_ID(id);
      setIdData(id);
      setcampIds([val.camp_num]);
      setCampArrData([
        {
          camp_num: val.camp_num,
          order: val.support_order,
        },
      ]);
    } else if (cardCamp_ID && cardCamp_ID == id) {
      val.dis = true;
      setShowSaveChanges(true);
      setCardCamp_ID(id);
      setcampIds([...campIds, val.camp_num]);
      setCampArrData([
        ...CampArrData,
        {
          camp_num: val.camp_num,
          order: val.support_order,
        },
      ]);
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
      //setIsSupportedCampsModalVisible(false);
      setShowSaveChanges(false);
      fetchDirectSupportedCampsList();
    }
  };
  const removeCardSupportedCamps = (data) => {
    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
    setIsSupportedCampsModalVisible(true);
  };

  const removeSupport = async () => {
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      camp_num: "",
      type: "direct",
      action: "all",
      nick_name_id: nickNameId,
    };
    let res = await removeSupportedCampsEntireTopic(removeEntireData);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setIsSupportedCampsModalVisible(false);
      fetchDirectSupportedCampsList();
    }
  };
  const fetchDirectSupportedCampsList = async () => {
    let response = await getDirectSupportedCampsList();
    if (response && response.status_code === 200) {
      setDirectSupportedCampsList(response.data);
    }
  };
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
      search={search}
      removeSupport={removeSupport}
      handleClose={handleClose}
      saveChanges={saveChanges}
      showSaveChanges={showSaveChanges}
      setRevertBack={setRevertBack}
      revertBack={revertBack}
      handleRevertBack={handleRevertBack}
      visible={visible}
      idData={idData}
      handleOk={handleOk}
      handleCancel={handleCancel}
    />
  );
};

export default DirectSupportedCamps;
