import { Fragment, useState, useEffect } from "react";
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
import {
  getLists,
  markNotificationRead,
  updateFCMToken,
} from "../../../../network/api/notificationAPI";
import { RootState } from "../../../../store";
import Fav from "./icon";
import isUserAuthenticated from "../../../../hooks/isUserAuthenticated";

const Notifications = ({}) => {
  const auth = isUserAuthenticated();
  const [isLog, setIsLog] = useState(auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => setIsLog(auth), [auth]);

  const { count, list } = useSelector((state: RootState) => {
    return {
      count: state.notifications.headerNotification.count,
      list: state.notifications.headerNotification.list,
    };
  });

  const router = useRouter();

  const updateToken = async (tc) => {
    const res = await updateFCMToken(tc);
  };

  const getListData = async () => {
    const res = await getLists();
    // if (res && res.status_code === 200) {
    //   console.log("[notification header]", res);
    // }
  };

  useEffect(() => {
    if (isLog) {
      getListData();
    }
  }, [isLog]);

  useEffect(() => {
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        const token2 = await localforage.getItem("fcm_token");
        if (token || token2) {
          console.log("[useEffect notification] token", token, token2);
          localforage.setItem("fcm_token", token2);
          // await updateToken(token2);
          setChecked(true);
          getMessage();
        }
      } catch (error) {
        // console.log(error);
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
        // console.log("[onSwitch ~ status]", status);

        if (status && status === "granted") {
          const fcm_token = await messaging.getToken({
            vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
          });
          console.log("[onSwitch ~ fcm_token]", fcm_token);

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
      await updateToken(null);
      setChecked(false);
    }
  };

  function getMessage() {
    const messaging = firebase.messaging();
    if ("serviceWorker" in navigator && "PushManager" in window) {
      // () => handleClickPushNotification(message?.data?.url)
      // navigator.serviceWorker.addEventListener("message", async (event) => {
      //   console.log("(event for the service worker event)", event);
      // console.log("(event for the service worker event data)", event.data);
      //   const url = event?.data.data["gcm.notification.url"];
      //   console.log(
      //     "🚀 ~ file: index.tsx ~ line 96 ~ navigator.serviceWorker.addEventListener ~ url",
      //     url,
      //     "title",
      //     event?.data?.notification?.title,
      //     "body",
      //     event?.data?.notification?.body
      //   );
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
        console.log(
          "[messaging.onMessage foreground Message]",
          message,
          "url",
          url
        );

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
            router.push({ pathname: url });
          },
        });
      });
    }
  }

  const onNotifyClick = async (id) => {
    await markNotificationRead(id);
  };

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
        <Link href="/notifications" passHref key="view_all">
          <a id="view-all-btn">View All</a>
        </Link>,
      ]}
    >
      <Lists list={list} onNotifyClick={onNotifyClick} />
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
