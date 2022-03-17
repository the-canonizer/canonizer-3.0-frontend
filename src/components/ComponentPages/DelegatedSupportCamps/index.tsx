import React, { useState } from "react";
import DelegatedSupportCampsUI from "./DelegatedSupportCampsUI";

const DelegatedSupportCamps = () => {
  const [isRemoveSupportModalVisible, setIsRemoveSupportModalVisible] =
    useState(false);

  const handleSupportedCampsCancel = () => {
    setIsRemoveSupportModalVisible(false);
  };

  const RemoveCardDelegatedSupportedCamps = () => {
    setIsRemoveSupportModalVisible(true);
  };
  const [viewMoreModalVisible, setViewmoreModalVisible] = useState(false);

  const showViewMoreModal = () => {
    setViewmoreModalVisible(true);
  };
  const handelViewMoreModalCancel = () => {
    setViewmoreModalVisible(false);
  };
  return (
    <DelegatedSupportCampsUI
      RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isRemoveSupportModalVisible={isRemoveSupportModalVisible}
      showViewMoreModal={showViewMoreModal}
      handelViewMoreModalCancel={handelViewMoreModalCancel}
      viewMoreModalVisible={viewMoreModalVisible}
    />
  );
};

export default DelegatedSupportCamps;
