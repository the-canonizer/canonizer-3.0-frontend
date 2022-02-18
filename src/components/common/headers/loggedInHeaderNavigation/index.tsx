import React from "react";
import { Button, Layout, Menu, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { logout } from "../../../../network/api/userApi";
import { AppDispatch, RootState } from "../../../../store";
import styles from "../siteHeader.module.scss";
import Image from "next/image";
import logo from "../../../../../public/images/logo.svg";
import HeaderMenu from "../HeaderMenu";

const { Header } = Layout;
const LoggedInHeaderNavigation = () => {
  const loggedInUser = useSelector<RootState>(
    (state) => state.auth.loggedInUser
  );
  const dispatch = useDispatch<AppDispatch>();

  const logOut = async () => {
    await logout();
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
  return (
    <>
      <Header className={styles.wrap}>
        <div className={styles.logo}>
          <Image alt="Logo" src={logo} />
        </div>
        <HeaderMenu></HeaderMenu>
        <div className={styles.right}>
          <div className="hdrUserdropdown">
            <i className="icon-user"></i>{" "}
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {loggedInUser ? loggedInUser["first_name"] : ""}
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>
    </>
  );
};

export default LoggedInHeaderNavigation;
