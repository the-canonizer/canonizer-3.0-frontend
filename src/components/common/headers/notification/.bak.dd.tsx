import "firebase/messaging";
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
import { BellOutlined, BellFilled, SmileOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import localforage from "localforage";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

import styles from "../siteHeader.module.scss";

// import { firebaseCloudMessaging } from "../../../../firebaseConfig/firebase";

const Notifications = ({}) => {
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
  };

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
      if (!firebase?.apps?.length) {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        if ("serviceWorker" in navigator && "PushManager" in window) {
          onMessage(messaging, (payload) => {
            console.log("Message received. ", payload);
          });

          navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("event for the service worker", event);
          });

          navigator.serviceWorker
            .register("firebase-messaging-sw.js")
            .then(async (objServiceWorker) => {
              console.log("service worker registered", objServiceWorker);
              // const status = await Notification.requestPermission();

              // console.log(
              //   "🚀 ~ file: firebase.ts ~ line 37 ~ init: ~ status",
              //   status
              // );

              // if (status && status === "granted") {
              //   const fcm_token = await messaging.getToken({
              //     vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
              //   });

              //   console.log(
              //     "🚀 ~ file: index.tsx ~ line 71 ~ onSwitch ~ fcm_token",
              //     fcm_token
              //   );

              //   // Set token in our local storage
              //   if (fcm_token) {
              //     localforage.setItem("fcm_token", fcm_token);
              //     setChecked(true);
              //     getMessage();
              //     return fcm_token;
              //   }
              // }
            });
        }

        try {
          const token = await localforage.getItem("fcm_token");
          if (token) {
            console.log("[notification] setToken token", token);
            setChecked(true);
            getMessage();
            // onMessage(messaging, (payload) => {
            //   console.log(
            //     "🚀 ~ file: index.tsx ~ line 75 ~ onMessageListener ~ payload",
            //     payload
            //   );
            //   notification.open({
            //     message: payload?.notification?.title,
            //     description: payload?.notification?.body,
            //     icon: <SmileOutlined style={{ color: "#108ee9" }} />,
            //   });
            // });
          }
        } catch (error) {
          console.log(error);
        }
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

  const onSwitch = async (st, event) => {
    event.stopPropagation();
    if (st) {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        // messaging.onMessage((payload) => {
        //   console.log("Message received. ", payload);
        // });

        // navigator.serviceWorker.addEventListener("message", (event) => {
        //   console.log("event for the service worker", event);
        // });

        // code new
        // navigator.serviceWorker
        //   .register("firebase-messaging-sw.js")
        //   .then(async (objServiceWorker) => {
        //     console.log("service worker registered", objServiceWorker);
        const messaging = firebase.messaging();
        // {
        // vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
        // }
        const status = await Notification.requestPermission();

        console.log(
          "🚀 ~ file: firebase.ts ~ line 37 ~ init: ~ status",
          status
        );

        if (status && status === "granted") {
          const fcm_token = await getToken(messaging, {
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
            getMessage();
            return fcm_token;
          }
        }
        //   });
        //     messaging.useServiceWorker(objServiceWorker);
        //     messaging
        //       .requestPermission()
        //       .then(function () {
        //         console.log("Notification permission granted.");

        //         // get the token in the form of promise
        //         return messaging.getToken();
        //       })
        //       .then(function (token) {
        //         //subscribe click
        //         // ...save token to db
        //         //unsubscribe click
        //         // ...delete token from db
        //       })
        //       .catch(function (err) {
        //         console.log("Unable to get permission to notify.", err);
        //         // fallback();
        //       });
        //   })
        //   .catch(function (err) {
        //     console.log("Service worker registration failed, error:", err);
        //     // fallback();
        //   });
        // code new
      }
    } else {
      // await localforage.removeItem("fcm_token");
    }
  };

  // Get the push notification message and triggers a toast to display it
  function getMessage() {
    // const messaging = firebase.messaging();
    // const app = initializeApp(firebaseConfig);
    const messaging = getMessaging();
    // const notification = new Notification();
    onMessage(messaging, (message) => {
      console.log("[onMessage,onMessage]", message);
      // () => handleClickPushNotification(message?.data?.url)
      const title = message.notification.title;
      console.log("🚀 ~ file: index.tsx ~ line 228 ~ onMessage ~ title", title);
      const options = {
        body: message.notification.body,
        icon: message?.notification["icon"],
      };
      console.log(
        "🚀 ~ file: index.tsx ~ line 233 ~ onMessage ~ options",
        options
      );
      new Notification(title, options);
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
