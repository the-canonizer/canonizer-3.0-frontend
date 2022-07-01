import "firebase/messaging";
import firebase from "firebase/compat/app";
import { Fragment, useEffect } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useRouter } from "next/router";

import { firebaseCloudMessaging } from "../../../firebaseConfig/firebase";

function PushNotificationLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    (async function registerService() {
      // Event listener that listens for the push notification event in the background
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.log("event for the service worker", event);
        });

        // const firebaseConfig = encodeURIComponent(
        //   JSON.stringify({
        //     apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
        //     authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
        //     projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
        //     storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
        //     messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
        //     appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
        //     measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
        //   })
        // );

        // await navigator.serviceWorker
        //   .register(`/firebase-messaging-sw.js`)
        //   .then(function (registration) {
        //     console.log(
        //       "Registration successful, scope is:",
        //       registration.scope
        //     );
        //   })
        //   .catch(function (err) {
        //     console.log("Service worker registration failed, error:", err);
        //   });
      }
    })();

    // Calls the getMessage() function if the token is there
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("token", token);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }

    setToken();
  });

  // Handles the click function on the toast showing push notification
  const handleClickPushNotification = (url) => {
    router.push(url);
  };

  // Get the push notification message and triggers a toast to display it
  function getMessage() {
    const messaging = firebase.messaging();
    console.log("🚀 ~ file: index.tsx ~ line 70 ~ getMessage ~ messaging", messaging)
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

  return <Fragment>{children}</Fragment>;
}

export default PushNotificationLayout;
