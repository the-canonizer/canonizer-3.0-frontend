import { Fragment, useState, useEffect } from "react";
import { Dropdown, Badge, Card, Typography, Switch, notification } from "antd";
import Link from "next/link";
import { BellOutlined, SmileOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import localforage from "localforage";
import firebase from "firebase/app";
import { useSelector } from "react-redux";

import styles from "../siteHeader.module.scss";

import { firebaseCloudMessaging } from "../../../../firebaseConfig/firebase";
import Lists from "../../../ComponentPages/Notifications/UI/list";
import { getLists } from "../../../../network/api/notificationAPI";
import { RootState } from "../../../../store";

const Notifications = ({}) => {
  const [checked, setChecked] = useState(false);

  const { count, list } = useSelector((state: RootState) => {
    return {
      count: state.notifications.headerNotification.count,
      list: state.notifications.headerNotification.list,
    };
  });

  const router = useRouter();

  const getListData = async () => {
    const res = await getLists();
    // if (res && res.status_code === 200) {
    //   console.log("[notification header]", res);
    // }
  };

  useEffect(() => {
    getListData();
  }, []);

  useEffect(() => {
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("[useEffect notification] token", token);
          setChecked(true);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }

    setToken();
  });

  const onSwitch = async (st, event) => {
    event.stopPropagation();
    if (st) {
      const messaging = firebase.messaging();
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const status = await Notification.requestPermission();
        console.log("[onSwitch ~ status]", status);

        if (status && status === "granted") {
          const fcm_token = await messaging.getToken({
            vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
          });
          console.log("[onSwitch ~ fcm_token]", fcm_token);

          // Set token in our local storage
          if (fcm_token) {
            localforage.setItem("fcm_token", fcm_token);
            setChecked(true);
            getMessage();
          }
        }
      }
    } else {
      // await localforage.removeItem("fcm_token");
    }
  };

  function getMessage() {
    const messaging = firebase.messaging();

    // () => handleClickPushNotification(message?.data?.url)

    messaging.onMessage((message) => {
      const url = message.data["gcm.notification.url"];
      console.log(
        "[messaging.onMessage foreground Message]",
        message,
        "url",
        url
      );

      const title = message.notification.title;

      const options = {
        body: message.notification.body,
        icon: message?.notification["icon"],
      };

      new Notification(title, options);

      notification.open({
        message: message?.notification?.title,
        description: message?.notification?.body,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        onClick: () => {
          router.push({ pathname: url });
        },
      });
    });
  }

  const notificationDropdown = (
    <Card
      className={styles.notificationCard}
      title={
        <Fragment>
          <Typography.Title
            className={styles.notTitle}
            level={4}
            id="notification-title"
          >
            notifications
          </Typography.Title>
          <Typography.Text className={styles.notificationEBTN}>
            <small>Enable push notification </small>
            <Switch
              size="small"
              checked={checked}
              onClick={onSwitch}
              onChange={(e, e1) => e1.stopPropagation()}
            />
          </Typography.Text>
        </Fragment>
      }
      actions={[
        <Link href="/user/notifications/22" passHref key="view_all">
          <a id="view-all-btn">View All</a>
        </Link>,
      ]}
    >
      <Lists list={list} />
    </Card>
  );

  return (
    <Fragment>
      <Dropdown
        overlay={notificationDropdown}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Badge
          count={count}
          color="orange"
          size="small"
          className={styles.badgeCls}
        >
          <BellOutlined className={styles.bellIcon} />
        </Badge>
      </Dropdown>
    </Fragment>
  );
};

export default Notifications;
