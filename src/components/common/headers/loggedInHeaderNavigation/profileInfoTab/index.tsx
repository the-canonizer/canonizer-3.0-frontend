import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Menu, Dropdown, Button, Space, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import styles from "../../siteHeader.module.scss";
import Link from "next/link";

import Notifications from "../../notification";
import md5 from "md5";
import {
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";

const ProfileInfoTab = ({
  isGravatarImage,
  loadingImage,
  loggedUser,
  toggleMobNav,
  logOut,
  isMobile,
  menu = <></>,
}) => {
  console.log(isMobile);
  const { loggedInUser, list } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    list: state.notifications.headerNotification.list,
  }));
  let dataMain = (
    <Space size={isMobile ? "small" : "large"}>
      {/* <i className="icon-user"></i>{" "} */}

      {loggedInUser?.profile_picture && !loadingImage ? (
        <Avatar
          src={loggedInUser?.profile_picture}
          size={isMobile ? "small" : "default"}
        />
      ) : isGravatarImage && !loadingImage ? (
        <Avatar
          src={`https://www.gravatar.com/avatar/${md5(
            loggedInUser?.email
          )}.png`}
        />
      ) : (
        <Avatar
          style={{
            border: "1px solid #fff",
            color: "#fff",
            backgroundColor: "#4484ce",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: `${isMobile ? "12px" : ""}`,
          }}
          size={isMobile ? "small" : "default"}
        >
          {loggedUser["first_name"].charAt(0).toUpperCase() +
            loggedUser["last_name"].charAt(0).toUpperCase()}
        </Avatar>
      )}
      {isMobile ? (
        <div>
          {loggedUser ? loggedUser["first_name"] : ""}{" "}
          {loggedUser ? loggedUser["last_name"] : ""}
        </div>
      ) : (
        <>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {loggedUser ? loggedUser["first_name"] : ""}{" "}
            {loggedUser ? loggedUser["last_name"] : ""}
          </a>
          <DownOutlined
            style={{
              fontSize: "15px",
              color: "#fff",
              cursor: "pointer",
            }}
          />
        </>
      )}
    </Space>
  );
  return (
    <Fragment>
      <div
        className={styles.btnsLoginRegister}
        key={isMobile ? "" : "registerbtnarea"}
      >
        <div
          className="hdrUserdropdown"
          key={isMobile ? "" : "hdrUserdropdown"}
        >
          {isMobile ? (
            dataMain
          ) : (
            <Space size={15}>
              <div className={styles.not_2}>
                <Notifications />
              </div>
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomLeft"
              >
                {dataMain}
              </Dropdown>
            </Space>
          )}
        </div>
      </div>
      {isMobile ? (
        <div className={`mobile_tag ${styles.mobMenuWithIcons}`}>
          <Link href="/settings">
            <a onClick={toggleMobNav}>
              <SettingOutlined />
              Account Settings
            </a>
          </Link>
          <Link href="/settings?tab=supported_camps" passHref>
            <a onClick={toggleMobNav}>
              <CheckCircleOutlined />
              Supported Camps
            </a>
          </Link>
          <a onClick={logOut}>
            <LogoutOutlined />
            Log Out
          </a>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};
export default ProfileInfoTab;
