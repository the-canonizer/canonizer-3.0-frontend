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
import ForgotModal from "@/components/ComponentPages/ForgotPassword/forgotPasswordModal";

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
      link: "/upload",
      linkTitle: "Upload Files",
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
    {
      link: "/services",
      linkTitle: "Services",
      id: 7,
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
                    <Link href={item.link}>{item.linkTitle}</Link>
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
              <i className="icon-user"></i> Log in
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
      <LoginModal />
      <RegistrationModal />
      <ForgotModal />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
