import React, { useState, useEffect } from "react";
import { Typography, Switch, notification, Spin, message } from "antd";
import { useRouter } from "next/router";
import localforage from "localforage";
import firebase from "firebase/app";

import { firebaseCloudMessaging } from "src/firebaseConfig/firebase";
import { updateFCMToken } from "src/network/api/notificationAPI";

import Fav from "./icon";

const NotificationSwitch = () => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const updateToken = async (tc: string) => {
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
        // log error or whatever you do
      }
    }

    setToken();
  }, []);

  const onSwitch = async (st: any, event: any) => {
    setIsLoading(true);
    event.preventDefault();
    event.stopPropagation();

    if (st) {
      const registration = await navigator.serviceWorker.ready;

      const messaging = firebase.messaging();

      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const status = await Notification.requestPermission();
          if (status === "granted") {
            const fcm_token = await messaging.getToken({
              vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
              serviceWorkerRegistration: registration,
            });

            if (fcm_token) {
              await localforage.setItem("fcm_token", fcm_token);
              await updateToken(fcm_token);
              setChecked(true);
              getMessage();
              setIsLoading(false);
            } else {
              message.info("Something went wrong!");
              setIsLoading(false);
            }
          } else {
            message.info("Notification permission denied!");
            setIsLoading(false);
          }
        } catch (error) {
          message.error("Failed to request notification permission:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        message.error(
          "Something went wrong or Push notification is not supported in this device."
        );
        setIsLoading(false);
      }
    } else {
      await localforage.removeItem("fcm_token");
      await updateToken("disabled");
      setChecked(false);
      setIsLoading(false);
    }
  };

  function getMessage() {
    const messaging = firebase.messaging();
    if ("serviceWorker" in navigator && "PushManager" in window) {
      messaging.onMessage((message) => {
        const url = message.data["gcm.notification.url"];

        notification.open({
          message: message?.notification?.title,
          description: message?.notification?.body,
          icon: <Fav />,
          onClick: () => {
            router?.push(url);
          },
        });
      });
    }
  }

  console.log("checked-----", checked);

  return (
    <Typography.Text className="flex items-center justify-between text-muted text-sm">
      <small data-testid="enable-text" className="block mr-2">
        Enable push notification{" "}
      </small>
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <Switch
          size="small"
          checked={checked}
          onClick={onSwitch}
          onChange={(e, e1) => {
            e1.stopPropagation();
            e1.preventDefault();
          }}
        />
      )}
    </Typography.Text>
  );
};

export default NotificationSwitch;
