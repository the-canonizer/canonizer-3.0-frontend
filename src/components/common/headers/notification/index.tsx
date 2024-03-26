import React, { Fragment, useState, useEffect } from "react";
import {
  Dropdown,
  Badge,
  Card,
  Typography,
  Switch,
  notification,
  Spin,
  message,
} from "antd";
import Link from "next/link";
import { BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import localforage from "localforage";
import firebase from "firebase/app";
import { useSelector } from "react-redux";

import styles from "../siteHeader.module.scss";

import { firebaseCloudMessaging } from "src/firebaseConfig/firebase";
import Lists from "src/components/ComponentPages/Notifications/UI/List";
import { updateFCMToken, getLists } from "src/network/api/notificationAPI";
import { RootState } from "src/store";

import Fav from "./icon";

const Notifications = () => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { count, list } = useSelector((state: RootState) => {
    return {
      count: state.notifications.headerNotification.count,
      list: state.notifications.headerNotification.list,
    };
  });
  const { manageSupportStatusCheck } = useSelector((state: RootState) => ({
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));
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
        // log error or whateever you do
      }
    }

    setToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSwitch = async (st: any, event: { stopPropagation: () => void }) => {
    setIsLoading(true);
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
            <small data-testid="enable-text">Enable push notification </small>
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <Switch
                size="small"
                checked={checked}
                onClick={onSwitch}
                onChange={(e, e1) => e1.stopPropagation()}
              />
            )}
          </Typography.Text>
        </Fragment>
      }
      actions={[
        <Link href="/notifications" passHref key="view_all">
          <a id="view-all-btn">View All</a>
        </Link>,
      ]}
    >
      <Lists list={list} />
    </Card>
  );

  const getNotofications = async (e) => {
    if (e) {
      await getLists(1, 5, 1);
    }
  };

  return (
    <Fragment>
      <Dropdown
        menu={{}}
        // overlay={notificationDropdown}
        dropdownRender={() =>
          !manageSupportStatusCheck ? notificationDropdown : ""
        }
        trigger={["click"]}
        placement="bottomRight"
        onOpenChange={getNotofications}
      >
        <Badge
          count={count}
          color="orange"
          size="small"
          className={styles.badgeCls}
          data-testid="clickable"
        >
          <BellOutlined className={styles.bellIcon} />
        </Badge>
      </Dropdown>
    </Fragment>
  );
};

export default Notifications;
