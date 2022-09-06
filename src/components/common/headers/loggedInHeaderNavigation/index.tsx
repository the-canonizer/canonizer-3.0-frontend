import { useRouter } from "next/router";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import { useSelector } from "react-redux";
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
      link: "https://canonizer.com/blog/",
      linkTitle: "Blog",
      id: 5,
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
        <a>
          <CheckCircleOutlined />
          Supported Camps
        </a>
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
                      {item?.external ? (
                        <a
                          href={item.link}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.linkTitle}
                        </a>
                      ) : (
                        <Link href={item.link}>{item.linkTitle}</Link>
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
