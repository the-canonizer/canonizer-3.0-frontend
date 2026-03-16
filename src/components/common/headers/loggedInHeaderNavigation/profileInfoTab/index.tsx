import React, { Fragment } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { useSelector } from "react-redux";
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
}: any) => {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));
  let dataMain = (
    <Space size={isMobile ? "small" : "large"}>
      {/* <i className="icon-user"></i>{" "} */}

      {loggedInUser?.profile_picture && !loadingImage ? (
        <Avatar
          style={{
            cursor: "pointer",
          }}
          src={loggedInUser?.profile_picture}
          size={isMobile ? "small" : "default"}
        />
      ) : isGravatarImage && !loadingImage ? (
        loggedInUser?.email && <Avatar src={isGravatarImage} />
      ) : (
        <Avatar
          style={{
            border: "1px solid #fff",
            color: "#fff",
            backgroundColor: "#2d6a4f",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: `${isMobile ? "12px" : ""}`,
            cursor: "pointer",
          }}
          size={isMobile ? "small" : "default"}
        >
          {loggedUser &&
            loggedUser["first_name"].charAt(0).toUpperCase() + loggedUser &&
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
          {/* <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {loggedUser ? loggedUser["first_name"] : ""}{" "}
            {loggedUser ? loggedUser["last_name"] : ""}
          </a> */}
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
                dropdownRender={() => menu}
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
          <Link href="/settings" onClick={toggleMobNav}>
              <SettingOutlined />
              Account Settings
          </Link>
          <Link href="/settings?tab=supported_camps" onClick={toggleMobNav}>
              <CheckCircleOutlined />
              Supported Camps
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
