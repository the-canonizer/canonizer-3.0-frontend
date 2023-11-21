import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import styles from "../siteHeader.module.scss";

import { logout } from "../../../../network/api/userApi";
import { RootState } from "../../../../store";
import Logo from "../logoHeader";
import {
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Notifications from "../notification";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getLists,
  markNotificationRead,
} from "src/network/api/notificationAPI";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import HeaderMenu from "../HeaderMenu";
import Image from "next/image";

const { Header } = Layout;

const LoggedInHeaderNavigation = ({ isLoginPage = false }: any) => {
  const { loggedInUser, list } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    list: state.notifications.headerNotification.list,
  }));

  const { isUserAuthenticated } = useAuthentication();
  const dispatch = useDispatch();
  const router = useRouter();

  const [loggedUser, setLoggedUser] = useState(loggedInUser);
  const [isActive, setActive] = useState(false);

  const toggleMobNav = () => {
    setActive(!isActive);
  };

  const getListData = async () => {
    if (isUserAuthenticated) {
      await getLists();
    }
  };

  useEffect(() => {
    if (!list?.length) {
      getListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  const onNotifyClick = async (id) => {
    dispatch(setManageSupportStatusCheck(false));
    const res = await markNotificationRead(id);
    if (res && res.status_code === 200) {
      delete router?.query?.from;
      // router?.query.from = "";
      router?.replace(router);
    }
  };

  useEffect(() => {
    const q = router?.query;
    if (q && q.from && q.from.includes("notify_")) {
      const fArr = (q.from as String).split("_");
      if (+fArr[1]) {
        onNotifyClick(+fArr[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logOut = async () => {
    const res = await logout();
    if (res?.status_code === 200) {
      router?.push("/");
    }
  };

  const onClick = ({ key }) => {
    if (key == 3) {
      logOut();
    }
  };

  const menu = (
    <Menu onClick={onClick} className={styles.menuItems}>
      <Menu.Item key="0">
        <Link href="/settings" passHref>
          <a>
            <SettingOutlined />
            Account Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Link href="/settings?tab=supported_camps" passHref>
          <a>
            <CheckCircleOutlined />
            Supported Camps
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <LogoutOutlined />
        Log Out
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    setLoggedUser(loggedInUser);
  }, [loggedInUser]);

  return (
    <>
      <React.Fragment>
        <Header className={styles.wrap}>
          <Logo />
          <div
            className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}
          >
            <div className={styles.mobLogoIcon}>
              <Logo />
            </div>
            <Button
              size="large"
              className={`${styles.btnCloseMobMenu} mb-4 float-right`}
              onClick={toggleMobNav}
            >
              <CloseOutlined />
            </Button>

            <HeaderMenu loggedUser={loggedUser} />

            {!isLoginPage ? (
              <Fragment>
                <div className={styles.btnsLoginRegister}>
                  <div className="hdrUserdropdown">
                    <Space size="large">
                      {/* <i className="icon-user"></i>{" "} */}
                      <Image
                        alt="display-picture"
                        width={35}
                        height={35}
                        style={{ borderRadius: "50px" }}
                        src="https://aws-315.s3.ap-south-1.amazonaws.com/profile/TWFsaWExMjMwTWFsaWE%3D_1700577047_509823.jpeg"
                      />
                      <span
                        style={{
                          border: "1px solid",
                          borderRadius: "50px",
                          padding: "10px",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bolder",
                          backgroundColor: "green",
                        }}
                      >
                        {loggedUser["first_name"].charAt(0).toUpperCase() +
                          loggedUser["last_name"].charAt(0).toUpperCase()}
                      </span>
                      <div>
                        {loggedUser ? loggedUser["first_name"] : ""}{" "}
                        {loggedUser ? loggedUser["last_name"] : ""}
                      </div>
                    </Space>
                  </div>
                </div>
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
              </Fragment>
            ) : null}
          </div>

          <div
            className={`${styles.right} ${!isLoginPage ? styles.onlogin : ""}`}
            key="right-area"
          >
            {!isLoginPage ? (
              <div className={styles.btnsLoginRegister} key="registerbtnarea">
                <div className="hdrUserdropdown" key="hdrUserdropdown">
                  <Space size={40}>
                    <div className={styles.not_2}>
                      <Notifications />
                    </div>
                    <Dropdown
                      overlay={menu}
                      trigger={["click"]}
                      placement="bottomLeft"
                    >
                      <Space size="small">
                        {/* <i className="icon-user"></i>{" "} */}
                        <Image
                          alt="display-picture"
                          width={50}
                          height={50}
                          style={{ borderRadius: "50px" }}
                          src="https://aws-315.s3.ap-south-1.amazonaws.com/profile/TWFsaWExMjMwTWFsaWE%3D_1700577047_509823.jpeg"
                        />
                        <a
                          className="ant-dropdown-link"
                          onClick={(e) => e.preventDefault()}
                        >
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
                      </Space>
                    </Dropdown>
                  </Space>
                </div>
              </div>
            ) : null}
            <div className={styles.iconMobMenu}>
              {!isLoginPage ? (
                <div className={styles.mob_noti}>
                  <Notifications />
                </div>
              ) : null}
              <Button size="middle" onClick={toggleMobNav} key="outnline-btn">
                <MenuOutlined />
              </Button>
            </div>
          </div>
          <div
            className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
            onClick={toggleMobNav}
            key="toggle-menu"
          ></div>
        </Header>
      </React.Fragment>
    </>
  );
};

export default LoggedInHeaderNavigation;
