import { useRouter } from "next/router";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { logout } from "../../../../network/api/userApi";
import { RootState } from "../../../../store";
import styles from "../siteHeader.module.scss";
import React, { useEffect, useState } from "react";
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

const { Header } = Layout;
const LoggedInHeaderNavigation = ({ isLoginPage = false }) => {
  const { loggedInUser, list } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    list: state.notifications.headerNotification.list,
  }));

  const { isUserAuthenticated } = useAuthentication();
  const dispatch = useDispatch();

  const [loggedUser, setLoggedUser] = useState(loggedInUser);
  const router = useRouter();
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
  }, [isUserAuthenticated]);

  const onNotifyClick = async (id) => {
    dispatch(setManageSupportStatusCheck(false));
    const res = await markNotificationRead(id);
    if (res && res.status_code === 200) {
      router.query.from = "";
      router.replace(router);
    }
  };

  useEffect(() => {
    const q = router.query;
    if (q && q.from && q.from.includes("notify_")) {
      const fArr = (q.from as String).split("_");
      if (+fArr[1]) {
        onNotifyClick(+fArr[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const mockLinks = [
    {
      link: "/browse",
      linkTitle: "Browse",
      id: 1,
    },

    {
      link: "/uploadFile",
      linkTitle: "Upload File",
      id: 2,
    },
    {
      link: "/topic/132-Help/1-Agreement",
      linkTitle: "Help",
      id: 3,
    },
    {
      link: "/files/2012_amplifying_final.pdf",
      linkTitle: "White Paper",
      id: 4,
      external: true,
    },
    {
      link: process.env.NEXT_PUBLIC_BLOG_URL,
      linkTitle: "Blog",
      id: 5,
      external: true,
    },
    {
      link: "/topic/6-Canonizer-Jobs/1-Agreement",
      linkTitle: "Jobs",
      id: 6,
    },
  ];

  const logOut = async () => {
    const res = await logout();
    if (res?.status_code === 200) {
      router.push("/");
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
  const filterMockLinks = mockLinks.filter((obj) => {
    return obj.linkTitle != "Upload File";
  });
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
            <Button
              size="large"
              className={`${styles.btnCloseMobMenu} mb-4 float-right`}
              onClick={toggleMobNav}
            >
              <CloseOutlined />
            </Button>

            <nav className={styles.nav}>
              <ul>
                {/* <li className={router.asPath === "/browse" ? styles.active : ""}>
                <Link href="/browse"> Browse </Link>
              </li> */}

                {(loggedInUser?.is_admin == true
                  ? mockLinks
                  : filterMockLinks
                )?.map((item) => {
                  return (
                    <li
                      // className={
                      //   router.asPath === "/browse" ? styles.active : ""
                      // }
                      key={item.id}
                    >
                      {router.asPath.includes("/topic") || item.external ? (
                        <a
                          href={item.link}
                          rel="noopener noreferrer"
                          target={item.external ? "_blank" : "_self"}
                          // className="dsadas"
                        >
                          {item.linkTitle}
                        </a>
                      ) : (
                        <Link href={item.link}>
                          <a>{item.linkTitle}</a>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
            {!isLoginPage ? (
              <>
                <div className={styles.btnsLoginRegister}>
                  <div className="hdrUserdropdown">
                    <Space size="large">
                      <i className="icon-user"></i>{" "}
                      <div>
                        {loggedUser ? loggedUser["first_name"] : ""}{" "}
                        {loggedUser ? loggedUser["last_name"] : ""}
                      </div>
                    </Space>
                  </div>
                </div>
                <div className="mobile_tag">
                  <Link href="/settings">Account Settings</Link>
                  <Link href="/settings?tab=supported_camps" passHref>
                    <a>Supported Camps</a>
                  </Link>
                  <a onClick={logOut}>Log Out</a>
                </div>
              </>
            ) : null}
          </div>
          <div
            className={`${styles.right} ${isLoginPage ? styles.onlogin : ""}`}
          >
            {!isLoginPage ? (
              <div className={styles.btnsLoginRegister}>
                <div className="hdrUserdropdown">
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
                        <i className="icon-user"></i>{" "}
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
              <div className={styles.mob_noti}>
                <Notifications />
              </div>
              <Button size="middle" onClick={toggleMobNav}>
                <MenuOutlined />
              </Button>
            </div>
          </div>
          <div
            className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
            onClick={toggleMobNav}
          ></div>
        </Header>
      </React.Fragment>
    </>
  );
};

export default LoggedInHeaderNavigation;
