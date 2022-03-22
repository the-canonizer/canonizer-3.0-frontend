import React, { useState, useEffect } from "react";
import { getDirectSupportedCampsList } from "../../../network/api/userApi";
import DirectSupportedCampsUI from "./DirectSupportedCampsUI";

const DirectSupportedCamps = ({ search }) => {
  const [directSupportedCampsList, setDirectSupportedCampsList] = useState([]);
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);

  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
  };

  const RemoveCardSupportedCamps = () => {
    setIsSupportedCampsModalVisible(true);
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
      RemoveCardSupportedCamps={RemoveCardSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isSupportedCampsModalVisible={isSupportedCampsModalVisible}
      directSupportedCampsList={directSupportedCampsList}
      search={search}
    />
  );
};

export default DirectSupportedCamps;
