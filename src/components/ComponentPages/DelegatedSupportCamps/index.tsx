import React, { useState, useEffect } from "react";
import { message } from "antd";

import {
  getDelegatedSupportCampsList,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import DelegatedSupportCampsUI from "./DelegatedSupportCampsUI";

const DelegatedSupportCamps = ({ search }: any) => {
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
  const [viewMoreModalVisible, setViewmoreModalVisible] = useState(false);
  const [viewMoreDataValue, setviewMoreDataValue] = useState([]);
  const [delegateSupportedSkeleton, setDelegateSupportedSkeleton] =
    useState(false);

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

  const showViewMoreModal = (e, data) => {
    setViewmoreModalVisible(true);
    setviewMoreDataValue(data);
  };

  const handelViewMoreModalCancel = () => {
    setViewmoreModalVisible(false);
  };

  const removeSupport = async (_, reasonData) => {
    const removeEntireData = {
      topic_num: removeTopicNumDataId,
      nick_name_id: nickNameId,
      delegated_nick_name_id: delegated_nick_name_id,
      ...reasonData,
    };

    let res = await removeSupportedCampsEntireTopic(removeEntireData);

    console.log("Response:", res); // Add this to see what the API returns

    if (res && res.status_code == 200) {
      if (typeof res.message === "string") {
        message.success(res.message); // Ensure this is a string
      } else {
        console.error("Expected a string but got:", res.message);
      }
      setIsRemoveSupportModalVisible(false);
      fetchDelegatedSupportCampsList();
    }
  };

  const fetchDelegatedSupportCampsList = async () => {
    setDelegateSupportedSkeleton(true);
    let response = await getDelegatedSupportCampsList();
    if (response && response.status_code === 200) {
      {
        response.data.length > 0 ? "" : setStatusFlag(false);
      }
      setDelegatedSupportCampsList(response.data);
    }
    setDelegateSupportedSkeleton(false);
  };

  useEffect(() => {}, [statusFlag]);

  //onLoad
  useEffect(() => {
    fetchDelegatedSupportCampsList();
  }, []);

  useEffect(() => {
    return () => {
      setDelegatedSupportCampsList(null);
    };
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
      delegateSupportedSkeleton={delegateSupportedSkeleton}
    />
  );
};

export default DelegatedSupportCamps;
