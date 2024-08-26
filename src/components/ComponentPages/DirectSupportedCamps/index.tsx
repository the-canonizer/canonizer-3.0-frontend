import React, { useState, useEffect } from "react";
import { message } from "antd";
import dynamic from "next/dynamic";

import {
  getDirectSupportedCampsList,
  removeOrUpdateDirectSupportCamps,
} from "../../../network/api/userApi";
import { setOpenDrawerForDirectSupportedCamp } from "src/store/slices/campDetailSlice";
import { useDispatch } from "react-redux";
const DirectSupportedCampsUI = dynamic(
  () => import("./DirectSupportedCampsUI"),
  { ssr: false }
);

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
  const [cardCamp_ID, setCardCamp_ID] = useState("");
  const [campIds, setcampIds] = useState([]);
  const [CardData, setCardData] = useState([]);
  const [revertBack, setRevertBack] = useState([]);
  const [idData, setIdData] = useState("");
  const [statusFlag, setStatusFlag] = useState(true);
  const [directSkeletonIndicator, setDirectSkeletonIndicator] = useState(false);
  const [modalPopupText, setModalPopupText] = useState(false);
  const [removeCampLink, setRemoveCamplink] = useState([]);
  const [isChangingOrder, setIsChangingOrder] = useState(false);

  const dispatch = useDispatch();
  
  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
    dispatch(setOpenDrawerForDirectSupportedCamp(false));
  };

  const handleSupportedCampsOpen = (data) => {
    setModalPopupText(false);
    setIsSupportedCampsModalVisible(true);
    setremoveSupportCampsData(data);
  };

  const handleRevertBack = (topicId, camps) => {
    let data = directSopportedCampsListRevert.filter((val) => {
      return val.topic_num == topicId;
    });
  
    if (data[0]?.camps?.length > 0) {
      let newData = [...directSupportedCampsList].map((val) => {
        if (val.topic_num == topicId) {
          return { ...val, camps: data[0].camps };
        } else {
          return val;
        }
      });
      setDirectSupportedCampsList(newData);
    }
  
    // Check if `camps` is an array before calling `map`
    if (Array.isArray(camps)) {
      camps.map((val) => {
        val.dis = false;
      });
    } else {
      console.error("`camps` is not an array:", camps);
    }
  
    setcampIds([]);
    setRemoveCamplink([]);
    setRevertBack(camps);
    setIsChangingOrder(false);
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
    handleRevertBack(cardCamp_ID, data[0]?.camps);
    Object.keys(val).length === 0
      ? setcampIds([])
      : ((val.dis = true),
        setcampIds([val.camp_num]),
        setRemoveCamplink([val]));
    setIdData(topicId), setCardCamp_ID(topicId);
    setVisible(false);
  };

  const handleClose = (val, id, data, CampsOrder) => {
    setCardData(CampsOrder.length > 0 ? CampsOrder : data.camps);
    if (cardCamp_ID == "") {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true),
          setcampIds([val.camp_num]),
          setRemoveCamplink([val]));
      setShowSaveChanges(true);
      setCardCamp_ID(id);
      setIdData(id);
    } else if (cardCamp_ID && cardCamp_ID == id) {
      Object.keys(val).length === 0
        ? setcampIds([])
        : ((val.dis = true),
          setcampIds([...campIds, val.camp_num]),
          setRemoveCamplink([...removeCampLink, val]));
      setShowSaveChanges(true);
      setCardCamp_ID(id);
    } else if (cardCamp_ID && cardCamp_ID != id) {
      setIdData(id);
      setVisible(true);
    }

    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
  };
  const saveChanges = async (reasonData) => {
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
      ...reasonData,
    };
    let res = await removeOrUpdateDirectSupportCamps(tagsDeletedId);
    if (res && res.status_code == 200) {
      setShowSaveChanges(false);
      setCardCamp_ID("");
      fetchDirectSupportedCampsList();
      setIsChangingOrder(false);
      dispatch(setOpenDrawerForDirectSupportedCamp(false));

    }
    handleSupportedCampsCancel();
  };

  const removeCardSupportedCamps = (data) => {
    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
    setModalPopupText(true);
    setIsSupportedCampsModalVisible(true);
    setremoveSupportCampsData(data);
  };

  //remove Entire Card
  const removeSupport = async (reasonData) => {
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      remove_camps: [],
      type: "direct",
      action: "all",
      nick_name_id: nickNameId,
      order_update: [],
      ...reasonData,
    };
    let res = await removeOrUpdateDirectSupportCamps(removeEntireData);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setIsSupportedCampsModalVisible(false);
      dispatch(setOpenDrawerForDirectSupportedCamp(false));
      fetchDirectSupportedCampsList();
    }
  };
  const fetchDirectSupportedCampsList = async () => {
    setDirectSkeletonIndicator(true);
    let response = await getDirectSupportedCampsList();
    if (response && response.status_code === 200) {
      {
        response.data.length > 0 ? "" : setStatusFlag(false);
      }
      setDirectSupportedCampsList(response.data);
      setdirectSopportedCampsListRevert(response.data);
    }
    setDirectSkeletonIndicator(false);
  };

  useEffect(() => { }, [statusFlag]);

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
      directSkeletonIndicator={directSkeletonIndicator}
      handleSupportedCampsOpen={handleSupportedCampsOpen}
      modalPopupText={modalPopupText}
      campIds={campIds}
      CardData={CardData}
      removeCampLink={removeCampLink}
      isChangingOrder={isChangingOrder}
      setIsChangingOrder={setIsChangingOrder}
    />
  );
};

export default DirectSupportedCamps;
