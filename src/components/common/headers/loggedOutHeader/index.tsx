import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Layout } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import styles from "../siteHeader.module.scss";
import Logo from "../logoHeader";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import {
  showLoginModal,
  showRegistrationModal,
} from "../../../../store/slices/uiSlice";
import ForgotModal from "../../../ComponentPages/ForgotPassword/forgotPasswordModal";
import DisclaimerMsg from "../../disclaimer";

const { Header } = Layout;

const LoggedOutHeader = () => {
  const dispatch = useDispatch();
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

  const openLoginModal = () => dispatch(showLoginModal());
  const openRegistrationModal = () => dispatch(showRegistrationModal());

  return (
    <React.Fragment>
      <Header className={styles.wrap}>
        <Logo />
        <div className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}>
          <Button
            size="large"
            className={`${styles.btnCloseMobMenu} mb-4 float-right`}
            onClick={toggleMobNav}
          >
            <CloseOutlined />
          </Button>
          <nav className={styles.nav}>
            <ul>
              {mockLinks?.map((item) => {
                return (
                  <li
                    className={router.asPath === item.link ? styles.active : ""}
                    key={item.id}
                  >
                    {router.asPath.includes("/topic") ? (
                      <a
                        href={item.link}
                        rel="noopener noreferrer"
                        target={
                          item?.linkTitle == "White Paper" ? "_blank" : "_self"
                        }
                        className="dsadas"
                      >
                        {item.linkTitle}
                      </a>
                    ) : (
                      <Link href={item.link} passHref>
                        <a>{item.linkTitle}</a>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
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
        <div className={styles.right}>
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
          <div className={styles.iconMobMenu}>
            <Button size="large" onClick={toggleMobNav}>
              <MenuOutlined />
            </Button>
          </div>
        </div>
        <div
          className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
          onClick={toggleMobNav}
        ></div>
      </Header>
      <SearchSection />
      <DisclaimerMsg />
      <LoginModal />
      <RegistrationModal />
      <ForgotModal />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
