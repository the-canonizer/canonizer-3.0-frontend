import React, { useState } from "react";
import SupportedCampsUI from "./SupportedCampsUI";

const SupportedCamps = () => {
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);

  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
  };

  const RemoveCardSupportedCamps = () => {
    setIsSupportedCampsModalVisible(true);
  };
  return (
    <SupportedCampsUI
      RemoveCardSupportedCamps={RemoveCardSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isSupportedCampsModalVisible={isSupportedCampsModalVisible}
    />
  );
};

export default SupportedCamps;
