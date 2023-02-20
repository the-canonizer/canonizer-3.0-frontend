import React, { Fragment, useState, useEffect } from "react";
import { Dropdown, Badge, Card, Typography, Switch, notification } from "antd";
import Link from "next/link";
import { BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import localforage from "localforage";
import firebase from "firebase/app";
import { useSelector } from "react-redux";

import styles from "../siteHeader.module.scss";

import { firebaseCloudMessaging } from "../../../../firebaseConfig/firebase";
import Lists from "../../../ComponentPages/Notifications/UI/List";
import { updateFCMToken } from "../../../../network/api/notificationAPI";
import { RootState } from "../../../../store";
import Fav from "./icon";

const Notifications = () => {
  const [checked, setChecked] = useState(false);

  const { count, list } = useSelector((state: RootState) => {
    return {
      count: state.notifications.headerNotification.count,
      list: state.notifications.headerNotification.list,
    };
  });

  const router = useRouter();

  const updateToken = async (tc) => {
    await updateFCMToken(tc);
  };

  useEffect(() => {
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        const token2 = await localforage.getItem("fcm_token");

        if (token || token2) {
          localforage.setItem("fcm_token", token2);
          setChecked(true);
          getMessage();
        }
      } catch (error) {
        // log error or whateever you do
      }
    }

    setToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSwitch = async (st, event) => {
    event.stopPropagation();
    if (st) {
      const messaging = firebase.messaging();
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const status = await Notification.requestPermission();

        if (status && status === "granted") {
          const fcm_token = await messaging.getToken({
            vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
          });

          // Set token in our local storage
          if (fcm_token) {
            localforage.setItem("fcm_token", fcm_token);
            await updateToken(fcm_token);
            setChecked(true);
            getMessage();
          }
        }
      }
    } else {
      await localforage.removeItem("fcm_token");
      await updateToken("disabled");
      setChecked(false);
    }
  };

  function getMessage() {
    const messaging = firebase.messaging();
    if ("serviceWorker" in navigator && "PushManager" in window) {
      // () => handleClickPushNotification(message?.data?.url)
      // navigator.serviceWorker.addEventListener("message", async (event) => {
      //   const url = event?.data.data["gcm.notification.url"];

      //   notification.open({
      //     message: event?.data?.notification?.title,
      //     description: event?.data?.notification?.body,
      //     icon: <Fav />,
      //     onClick: () => {
      //       router.push({ pathname: url });
      //     },
      //   });
      // await getListData();
      // });

      messaging.onMessage((message) => {
        const url = message.data["gcm.notification.url"];

        // const title = message.notification.title;

        // const options = {
        //   body: message.notification.body,
        //   icon: message?.notification["icon"],
        // };

        // new Notification(title, options);

        notification.open({
          message: message?.notification?.title,
          description: message?.notification?.body,
          icon: <Fav />,
          onClick: () => {
            router.push(url);
          },
        });
      });
    }
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
        <Link href="/notifications" passHref key="view_all" id="view-all-btn">
          View All
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
