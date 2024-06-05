import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Layout } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import styles from "../siteHeader.module.scss";

import Logo from "../logoHeader";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "src/components/ComponentPages/Registration/registrationModal";
import { showLoginModal } from "../../../../store/slices/uiSlice";
import ForgotModal from "../../../ComponentPages/ForgotPassword/forgotPasswordModal";
import DisclaimerMsg from "../../disclaimer";
import HeaderMenu from "../HeaderMenu";
import TopicCreationBTN from "../TopicCreationBTN";
import ArchivedCampMsg from "../../ArchivedCampMsg";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const { Header } = Layout;

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <React.Fragment>
      <div className="flex justify-start items-center z-10 w-100 py-2">
        <Logo />
        <SearchHeader className="ml-5" />
        <HeaderMenu
          className="ml-auto"
          isUserAuthenticated={isUserAuthenticated}
        />
        {/* <div className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}>
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
              <i className="icon-user"></i> Log In
            </Button>
            <Button
              className={styles.btnRegister}
              onClick={openRegistrationModal}
            >
              <i className="icon-user-plus"></i> Register
            </Button>
          </div>
        </div> */}

        {/* <div className={styles.right} key="right-panel">
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
        </div> */}

        {/* <div
          className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
          onClick={toggleMobNav}
          key="toggle-btn"
        ></div> */}
      </div>
      {/* {isMobile == false ? (
        <section className="Mob_View">
          <div className="search_header">
            <HeaderMenu />
          </div>
        </section>
      ) : (
        <></>
      )} */}
      {/* <SearchSection /> */}
      {/* <div className="topicMobBTN">
        <TopicCreationBTN key="create-topic-area" />
      </div> */}
      {/* <DisclaimerMsg />
      <ArchivedCampMsg />
      <LoginModal />
      <RegistrationModal />
      <ForgotModal /> */}
    </React.Fragment>
  );
};

export default LoggedOutHeader;
