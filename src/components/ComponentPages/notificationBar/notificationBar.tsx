import { CheckCircleFilled } from "@ant-design/icons";
import { Button, notification } from "antd";
import React from "react";
export const openNotificationWithIcon = ({ type, message }: any) => {
  notification[type]({
    duration: 3,
    closeIcon: null,
    className: "thm-notification",
    icon: <CheckCircleFilled />,
    description: message,
  });
};
