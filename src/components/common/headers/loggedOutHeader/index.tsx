import React from 'react';
import { Button, Layout, Menu } from 'antd';
import Link from 'next/link';
import { UserOutlined, UserAddOutlined } from '@ant-design/icons';

import styles from "../siteHeader.module.scss";


import SearchSection from "../../search/search";

const LoggedOutHeader = () => {
  const { Header } = Layout;
  return (
    <React.Fragment>
      <Header className={styles.wrap}>
        <div className={styles.logo}>
          <img src={"/images/logo.svg"} alt="Logo" />
        </div>
        <nav className={styles.navWrap}>
          <Menu mode="horizontal" className={styles.nav}>
            <Menu.Item>
              <a href=""> Browse </a>
            </Menu.Item>
            <Menu.Item>
              <a href="">Upload File</a>
            </Menu.Item>
            <Menu.Item>
              <a href="">Help</a>
            </Menu.Item>
            <Menu.Item>
              <a href="">White Paper</a>
            </Menu.Item>
            <Menu.Item>
              <a href="">Blog</a>
            </Menu.Item>
            <Menu.Item>
              <a href="">Jobs</a>
            </Menu.Item>
            <Menu.Item>
              <a href="">Services</a>
            </Menu.Item>
          </Menu>
        </nav>
        <div className={styles.right}>
          <Button type="link" className={styles.btnLogin}><i className="icon-user"></i> Login</Button>
          <Button className={styles.btnRegister}><i className="icon-user-plus"></i> Register</Button>
        </div>
      </Header>
      <SearchSection />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
