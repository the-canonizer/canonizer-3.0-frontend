import React from "react";
import { Button, Layout, Menu } from "antd";
import { useDispatch } from "react-redux";

import styles from "../siteHeader.module.scss";

import SearchSection from "../../search/search";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import {
  showLoginModal,
  showRegistrationModal,
} from "../../../../store/slices/ui/uiSlice";

const { Header } = Layout;

const LoggedOutHeader = () => {
  const dispatch = useDispatch();

  const openLoginModal = () => dispatch(showLoginModal());
  const openRegistrationModal = () => dispatch(showRegistrationModal());

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
          <Button
            type="link"
            className={styles.btnLogin}
            onClick={openLoginModal}
          >
            <i className="icon-user"></i> Login
          </Button>
          <Button
            className={styles.btnRegister}
            onClick={openRegistrationModal}
          >
            <i className="icon-user-plus"></i> Register
          </Button>
        </div>
      </Header>
      <SearchSection />
      <LoginModal />
      <RegistrationModal />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
