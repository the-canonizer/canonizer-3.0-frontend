import React from "react";
import { Button, Layout, Menu, Dropdown } from "antd";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "../../../../network/services/auth";
import { AppDispatch } from "../../../../store";
import styles from "../siteHeader.module.scss";
import SearchSection from "../../search/search";
import LoginModal from "../../../componentPages/Login/loginModal";
import RegistrationModal from "../../../componentPages/registration/registrationModal";

const { Header } = Layout;
const LoggedInHeader = () => {
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
    <Menu onClick={onClick} >
      <Menu.Item key="0">
        <Link href="/settings">Account Settings</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <a >Support Camps</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" >Log Out</Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <Header className={styles.wrap}>
        <div className={styles.logo}>
          <img src={"/images/logo.svg"} alt="Logo" />
        </div>
        <nav className={styles.navWrap}>
          <Menu mode="horizontal" className={styles.nav}>
            <Menu.Item key={0}>
              <a href=""> Browse </a>
            </Menu.Item>
            <Menu.Item key={1}>
              <a href="">Upload File</a>
            </Menu.Item>
            <Menu.Item key={2}>
              <a href="">Help</a>
            </Menu.Item>
            <Menu.Item key={3}>
              <a href="">White Paper</a>
            </Menu.Item>
            <Menu.Item key={4}>
              <a href="">Blog</a>
            </Menu.Item>
            <Menu.Item key={5}>
              <a href="">Jobs</a>
            </Menu.Item>
            <Menu.Item key={6}>
              <a href="">Services</a>
            </Menu.Item>
          </Menu>
        </nav>
        <div className={styles.right}>
          <div className="hdrUserdropdown">            
            <i className="icon-user"></i> <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Daniel Mark
            </a>
            </Dropdown>
          </div>

        </div>
      </Header>
      <SearchSection />
      <LoginModal />
      <RegistrationModal />
    </React.Fragment>

  );
};

export default LoggedInHeader;
