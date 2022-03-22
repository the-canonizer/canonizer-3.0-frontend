import React, { useState, useEffect } from "react";
import { getDelegatedSupportCampsList } from "src/network/api/userApi";
import DelegatedSupportCampsUI from "./DelegatedSupportCampsUI";

const DelegatedSupportCamps = ({ search }) => {
  const [delegatedSupportCampsList, setDelegatedSupportCampsList] = useState(
    []
  );
  const [isRemoveSupportModalVisible, setIsRemoveSupportModalVisible] =
    useState(false);

  const handleSupportedCampsCancel = () => {
    setIsRemoveSupportModalVisible(false);
  };

  const RemoveCardDelegatedSupportedCamps = () => {
    setIsRemoveSupportModalVisible(true);
  };
  const [viewMoreModalVisible, setViewmoreModalVisible] = useState(false);
  const [viewMoreDataValue, setviewMoreDataValue] = useState([])
  const showViewMoreModal = (e,data) => {
    setViewmoreModalVisible(true);
    setviewMoreDataValue(data);
  };
  const handelViewMoreModalCancel = () => {
    setViewmoreModalVisible(false);
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
      RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isRemoveSupportModalVisible={isRemoveSupportModalVisible}
      showViewMoreModal={(e,data)=>showViewMoreModal(e,data)}
      viewMoreDataValue={viewMoreDataValue}
      handelViewMoreModalCancel={handelViewMoreModalCancel}
      viewMoreModalVisible={viewMoreModalVisible}
      delegatedSupportCampsList={delegatedSupportCampsList}
      search={search}
    />
  );
};

export default DelegatedSupportCamps;
