import React, { useState, useEffect } from "react";
import {
  getDelegatedSupportCampsList,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import { message } from "antd";
import DelegatedSupportCampsUI from "./DelegatedSupportCampsUI";

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
  const [statusFlag, setStatusFlag] = useState(true);

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
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      nick_name_id: nickNameId,
      delegated_nick_name_id: delegated_nick_name_id,
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
      {
        response.data.length > 0 ? "" : setStatusFlag(false);
      }
      setDelegatedSupportCampsList(response.data);
    }
  };
  useEffect(() => {}, [statusFlag]);
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
      statusFlag={statusFlag}
    />
  );
};

export default DelegatedSupportCamps;
