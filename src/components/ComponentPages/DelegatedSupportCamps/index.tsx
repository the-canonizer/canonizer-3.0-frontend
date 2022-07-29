import React, { useState, useEffect } from "react";
import {
  getDelegatedSupportCampsList,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import { message } from "antd";
import DelegatedSupportCampsUI from "./DelegatedSupportCampsUI";
import localforage from "localforage";

const DelegatedSupportCamps = ({ search }) => {
  const [delegatedSupportCampsList, setDelegatedSupportCampsList] = useState(
    []
  );
  const [isRemoveSupportModalVisible, setIsRemoveSupportModalVisible] =
    useState(false);
  const [removeTopicNumDataId, setRemoveTopicNumDataId] = useState("");
  const [nickNameId, setNickNameId] = useState("");
  const [delegated_nick_name_id, setDelegated_nick_name_id] = useState("");
  const [removeSupportCampsData, setRemoveSupportCampsData] = useState({});
  const handleSupportedCampsCancel = () => {
    setIsRemoveSupportModalVisible(false);
  };

  const removeCardDelegatedSupportedCamps = (data) => {
    setRemoveTopicNumDataId(data.topic_num);
    setNickNameId(data.nick_name_id);
    setIsRemoveSupportModalVisible(true);
    setDelegated_nick_name_id(data.delegated_nick_name_id);
    setRemoveSupportCampsData(data);
  };

  const [viewMoreModalVisible, setViewmoreModalVisible] = useState(false);
  const [viewMoreDataValue, setviewMoreDataValue] = useState([]);

  const showViewMoreModal = (e, data) => {
    setViewmoreModalVisible(true);
    setviewMoreDataValue(data);
  };
  const handelViewMoreModalCancel = () => {
    setViewmoreModalVisible(false);
  };
  const removeSupport = async () => {
    let fcm_token = await localforage.getItem("fcm_token");
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      nick_name_id: nickNameId,
      delegated_nick_name_id: delegated_nick_name_id,
      fcm_token,
    };

    let res = await removeSupportedCampsEntireTopic(removeEntireData);
    if (res && res.status_code == 200) {
      message.success(res.message);
      //setViewmoreModalVisible(false);
      setIsRemoveSupportModalVisible(false);
      fetchDelegatedSupportCampsList();
    }
  };
  const fetchDelegatedSupportCampsList = async () => {
    let response = await getDelegatedSupportCampsList();
    if (response && response.status_code === 200) {
      setDelegatedSupportCampsList(response.data);
    }
  };
  //onLoad
  useEffect(() => {
    fetchDelegatedSupportCampsList();
  }, []);

  return (
    <DelegatedSupportCampsUI
      removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isRemoveSupportModalVisible={isRemoveSupportModalVisible}
      showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
      viewMoreDataValue={viewMoreDataValue}
      handelViewMoreModalCancel={handelViewMoreModalCancel}
      viewMoreModalVisible={viewMoreModalVisible}
      delegatedSupportCampsList={delegatedSupportCampsList}
      search={search}
      removeSupport={removeSupport}
      removeSupportCampsData={removeSupportCampsData}
    />
  );
};

export default DelegatedSupportCamps;
