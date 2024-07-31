import { CheckCircleFilled } from "@ant-design/icons";
import { notification } from "antd";
import React from "react";

export const openNotificationWithIcon = (messageData) => {
  const { add: addMessage, remove: removeMessages, update: updateMessage } = messageData;

  const showMessage = (type, message) => {
    notification[type]({
      duration: 5,
      closeIcon: null,
      className: "thm-notification",
      icon: <CheckCircleFilled />,
      description: message,
    });
  };

  if (updateMessage) {
    showMessage("success", updateMessage);
  }

  if (addMessage) {
    showMessage("success", addMessage);
  }

  if (Array.isArray(removeMessages) && removeMessages.length > 0) {
    removeMessages.forEach((message) => {
      showMessage("error", message);
    });
  }
};
