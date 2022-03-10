import React, { useState } from "react";
import DirectSupportedCampsUI from "./DirectSupportedCampsUI";
import SupportedCampsUI from "./DirectSupportedCampsUI";

const DirectSupportedCamps = () => {
  const [isSupportedCampsModalVisible, setIsSupportedCampsModalVisible] =
    useState(false);

  const handleSupportedCampsCancel = () => {
    setIsSupportedCampsModalVisible(false);
  };

  const RemoveCardSupportedCamps = () => {
    setIsSupportedCampsModalVisible(true);
  };
  return (
    <DirectSupportedCampsUI
      RemoveCardSupportedCamps={RemoveCardSupportedCamps}
      handleSupportedCampsCancel={handleSupportedCampsCancel}
      isSupportedCampsModalVisible={isSupportedCampsModalVisible}
    />
  );
};

export default DirectSupportedCamps;
