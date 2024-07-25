import { CheckCircleFilled } from "@ant-design/icons";
import { Button, notification } from "antd";
import React from "react";
// const openNotificationWithIcon = (type) => {
//   notification[type]({
//     duration: 5,
//     closeIcon: null,
//     className: "thm-notification",
//     icon: <CheckCircleFilled />,

//     description:
//       "Your support from Camp: New research & Debating the theory has been removed.",
//   });
// };
// function NotificationBar() {
//   return (
//     <Button onClick={() => openNotificationWithIcon("success")}>Success</Button>
//   );
// }

// export default NotificationBar;

export const openNotificationWithIcon = ({ type, message }: any) => {
  notification[type]({
    duration: 5000,
    closeIcon: null,
    className: "thm-notification",
    icon: <CheckCircleFilled />,
    description: message,
  });
};
