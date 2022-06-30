import "firebase/compat/messaging";
import { Fragment, useState, useEffect } from "react";
import {
  Dropdown,
  Badge,
  Card,
  Typography,
  List,
  Switch,
  notification,
} from "antd";
import Link from "next/link";
import localforage from "localforage";
import firebase from "firebase/compat/app";
import { BellOutlined, BellFilled, SmileOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
// import { getMessaging } from "firebase/compat/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";

import styles from "../siteHeader.module.scss";

import { firebaseCloudMessaging } from "../../../../firebaseConfig/firebase";

const Notifications = ({}) => {
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  // const firebaseConfig = {
  //   apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  //   authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
  //   projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  //   storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  //   messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  //   appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
  //   measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
  // };

  const data = [
    {
      id: "1",
      title: "Rohit has made the following post to the Camp Agreement forum",
      time: "Today 11:56",
    },
    {
      id: "2",
      title:
        "Vikram has just added their support to this camp: Software Development Team",
      time: "Today 11:56",
    },
    {
      id: "3",
      title:
        "Sunil has just removed their support from this camp: Software Development Team",
      time: "Today 11:56",
    },
    {
      id: "4",
      title:
        "Reena has just added their support to this camp: Scalability Architecture / Server Ar...",
      time: "Today 11:56",
    },
  ];

  // Handles the click function on the toast showing push notification
  const handleClickPushNotification = (url) => {
    router.push(url);
  };

  useEffect(() => {
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("token", token);
          setChecked(true);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }

    setToken();

    // const getToken = async () => {
    //   const tokenInLocalForage = await localforage.getItem("fcm_token");
    //   if (tokenInLocalForage) {
    //     setChecked(true);
    //   }
    // };

    // getToken();
  });

  // useEffect(() => {
  //   const messaging = getMessaging();
  //   onBackgroundMessage(messaging, (payload) => {
  //     console.log(
  //       "[firebase-messaging-sw.js] Received background message ",
  //       payload
  //     );
  //     // Customize notification here
  //     const notificationTitle = "Background Message Title";
  //     const notificationOptions = {
  //       body: "Background Message body.",
  //       icon: "/firebase-logo.png",
  //     };

  //     self.registration.showNotification(
  //       notificationTitle,
  //       notificationOptions
  //     );
  //   });
  // }, []);

  const onSwitch = async (e, e1) => {
    e1.stopPropagation();
    console.log("🚀 ~ file: index.tsx ~ line 61 ~ onSwitch ~ e", e);
    if (e) {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.log("event for the service worker", event);
        });
      }
      const messaging = firebase.messaging();
      const status = await Notification.requestPermission();

      console.log("🚀 ~ file: firebase.ts ~ line 37 ~ init: ~ status", status);
      if (status && status === "granted") {
        // Get new token from Firebase
        const fcm_token = await messaging.getToken({
          vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
        });
        console.log(
          "🚀 ~ file: index.tsx ~ line 71 ~ onSwitch ~ fcm_token",
          fcm_token
        );

        // Set token in our local storage
        if (fcm_token) {
          localforage.setItem("fcm_token", fcm_token);
          setChecked(true);
          return fcm_token;
        }
      }
    } else {
      // const status = await Notification.close();
      // const n = new Notification(null, null);
      // // console.log("🚀 ~ file: index.tsx ~ line 87 ~ onSwitch ~ status", status);
      // if (document.visibilityState === "visible") {
      //   n.close();
      //   const loc = await localforage.removeItem("fcm_token");
      //   console.log("🚀 ~ file: index.tsx ~ line 92 ~ onSwitch ~ loc", loc)
      // }
    }
  };

  // Get the push notification message and triggers a toast to display it
  function getMessage() {
    const messaging = firebase.messaging();
    // const notification = new Notification();
    messaging.onMessage((message) => {
      console.log(
        "🚀 ~ file: index.tsx ~ line 45 ~ messaging.onMessage ~ message",
        message
      );
      // () => handleClickPushNotification(message?.data?.url)
      notification.open({
        message: message?.notification?.title,
        description: message?.notification?.body,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
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
        <Link href="#" passHref key="view_all">
          <a id="view-all-btn">View All</a>
        </Link>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        className={styles.list}
        id="list-items"
        renderItem={(item) => (
          <List.Item id={"list-item-" + item["id"]}>
            <List.Item.Meta
              avatar={
                <div className={styles.avatarBell}>
                  <BellFilled />
                </div>
              }
              title={<Link href="#">{item.title}</Link>}
              description={item.time}
            />
          </List.Item>
        )}
      />
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
          count={5}
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
