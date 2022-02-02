import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { Button, Layout, Menu, Row, Col } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import styles from "../siteHeader.module.scss";
import Logo from "../logoHeader";
import SearchSection from "../../search/search";
import LoginModal from "../../../componentPages/Login/loginModal";
import RegistrationModal from "../../../componentPages/registration/registrationModal";
import {
  showLoginModal,
  showRegistrationModal,
} from "../../../../store/slices/ui/uiSlice";

const { Header } = Layout;

const LoggedOutHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isActive, setActive] = useState(false);
  const toggleMobNav = () => {
    setActive(!isActive);
  };

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
              <li className={router.asPath === "/browse" ? styles.active : ""}>
                <Link href="/browse"> Browse </Link>
              </li>
              <li>
                <Link href="">Upload File</Link>
              </li>
              <li>
                <Link href="">Help</Link>
              </li>
              <li>
                <Link href="">White Paper</Link>
              </li>
              <li>
                <Link href="">Blog</Link>
              </li>
              <li>
                <Link href="">Jobs</Link>
              </li>
              <li>
                <Link href="">Services</Link>
              </li>
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
              <i className="icon-user"></i> Login
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
    </React.Fragment>
  );
};

export default LoggedOutHeader;
