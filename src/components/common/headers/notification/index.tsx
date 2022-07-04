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
import firebase from "firebase/app";

import { firebaseCloudMessaging } from "../../../../firebaseConfig/firebase";

import styles from "../siteHeader.module.scss";

const Notifications = ({}) => {
  const [checked, setChecked] = useState(false);

  const router = useRouter();

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
          <List.Item id={"list-item-" + item["id"]} key={item.id}>
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
