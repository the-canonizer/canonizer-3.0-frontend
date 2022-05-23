import React, { useState, useEffect } from "react";
import {
  getDirectSupportedCampsList,
  removeSupportedCampsEntireTopic,
} from "../../../network/api/userApi";
import { message } from "antd";
import DirectSupportedCampsUI from "./DirectSupportedCampsUI";

const DirectSupportedCamps = ({ search }) => {
  const [directSupportedCampsList, setDirectSupportedCampsList] = useState([]);
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);
  const [removeTopicNumDataId, setRemoveTopicNumDataId] = useState("");
  const [nickNameId, setNickNameId] = useState("");
  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
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
    console.log(response, "response");
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
    />
  );
};

export default DirectSupportedCamps;
