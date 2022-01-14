import React, { Fragment } from "react";
import { Button, Layout, Menu } from "antd";
import Link from "next/link";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";

import styles from "../siteHeader.module.scss";

import SearchSection from "../../search/search";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import { useDispatch, useSelector } from "react-redux";
import { showLoginModal } from "../../../../store/slices/ui/uiSlice";
import { RootState } from "../../../../store";

const { Header } = Layout;

const LoggedOutHeader = () => {
  const dispatch = useDispatch();

  const openModal = () => dispatch(showLoginModal());

  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );

  const authenticatedUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
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
          <Button type="link" className={styles.btnLogin} onClick={openModal}>
            <i className="icon-user"></i> Login
          </Button>
          <Button className={styles.btnRegister}>
            <i className="icon-user-plus"></i> Register
          </Button>
        </div>
      </Header>
      <SearchSection />
      <LoginModal />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
