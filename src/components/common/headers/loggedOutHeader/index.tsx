import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Layout } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import styles from "../siteHeader.module.scss";

import Logo from "../logoHeader";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import { showLoginModal } from "../../../../store/slices/uiSlice";
import ForgotModal from "../../../ComponentPages/ForgotPassword/forgotPasswordModal";
import DisclaimerMsg from "../../disclaimer";
import HeaderMenu from "../HeaderMenu";
import TopicCreationBTN from "../TopicCreationBTN";

const { Header } = Layout;

const LoggedOutHeader = ({}: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isActive, setActive] = useState(false);

  const toggleMobNav = () => {
    setActive(!isActive);
  };

  const openLoginModal = () => {
    if (
      router?.asPath?.includes("/login") ||
      router?.asPath?.includes("/registration")
    ) {
      router.push("/login");
    } else {
      dispatch(showLoginModal());
    }
  };

  const openRegistrationModal = () => router.push("registration");

  return (
    <React.Fragment>
      <Header className={styles.wrap} data-testid="loggedOutHeader">
        <Logo />
        <div className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}>
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

          <HeaderMenu loggedUser={null} />

          <div className={styles.btnsLoginRegister}>
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
        </div>

        <div className={styles.right} key="right-panel">
          <div className={styles.btnsLoginRegister} key="btns-area">
            <Button
              type="link"
              className={styles.btnLogin}
              onClick={openLoginModal}
              key="login-btn"
            >
              <i className="icon-user"></i> Log In
            </Button>
            <Button
              className={styles.btnRegister}
              onClick={openRegistrationModal}
              key="register-btn"
            >
              <i className="icon-user-plus"></i> Register
            </Button>
          </div>
          <div className={styles.iconMobMenu} key="mob-menu-area">
            <Button size="large" onClick={toggleMobNav} key="outline-btn">
              <MenuOutlined />
            </Button>
          </div>
        </div>

        <div
          className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
          onClick={toggleMobNav}
          key="toggle-btn"
        ></div>
      </Header>
      <SearchSection />
      <div className="topicMobBTN">
        <TopicCreationBTN key="create-topic-area" />
      </div>
      <DisclaimerMsg />
      <LoginModal />
      <ForgotModal />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
