import React from "react";
import { Button, Layout, Menu, Dropdown } from "antd";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "../../../../network/services/auth";
import { AppDispatch } from "../../../../store";
import styles from "../siteHeader.module.scss";
import Image from "next/image";
import logo from "../../../../../public/images/logo.svg";
import HeaderMenu from "../HeaderMenu";

const { Header } = Layout;
const LoggedInHeaderNavigation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logOut = async () => {
    await dispatch(logout());
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
                Daniel Mark
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>
    </>
  );
};

export default LoggedInHeaderNavigation;
