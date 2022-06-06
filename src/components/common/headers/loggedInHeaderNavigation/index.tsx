import { useRouter } from "next/router";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import { useSelector } from "react-redux";
import Link from "next/link";
import { logout } from "../../../../network/api/userApi";
import { RootState } from "../../../../store";
import styles from "../siteHeader.module.scss";
import React, { useEffect, useState } from "react";
import Logo from "../logoHeader";
import { MenuOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import Notifications from "../notification";

const { Header } = Layout;
const LoggedInHeaderNavigation = ({ isLoginPage = false }) => {
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const [loggedUser, setLoggedUser] = useState(loggedInUser);
  const router = useRouter();
  const [isActive, setActive] = useState(false);
  const toggleMobNav = () => {
    setActive(!isActive);
  };

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
      link: "/help",
      linkTitle: "Help",
      id: 3,
    },
    {
      link: "/white-paper",
      linkTitle: "White Paper",
      id: 4,
    },
    {
      link: "/blog",
      linkTitle: "Blog",
      id: 5,
    },
    {
      link: "/jobs",
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
    <Menu onClick={onClick}>
      <Menu.Item key="0">
        <Link href="/settings">Account Settings</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <a>Support Camps</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Log Out</Menu.Item>
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
                {mockLinks?.map((item) => {
                  return (
                    <li key={item.id}>
                      <Link href={item.link}>{item.linkTitle}</Link>
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
                  <a>Support Camps</a>
                  <a onClick={logOut}>Logout</a>
                </div>
              </>
            ) : null}
          </div>
          <div className={styles.right}>
            {!isLoginPage ? (
              <div className={styles.btnsLoginRegister}>
                <div className="hdrUserdropdown">
                  <Space size={40}>
                    <Notifications />
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
