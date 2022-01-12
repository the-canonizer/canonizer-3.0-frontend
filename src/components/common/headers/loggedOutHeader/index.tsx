import React from 'react';
import { Button, Layout, Menu, Row, Col } from 'antd';
import Link from 'next/link';
import { UserOutlined, UserAddOutlined } from '@ant-design/icons';

import styles from "../siteHeader.module.scss";


import SearchSection from "../../search/search";
import HelpCard from "../../helpCard/help";
import CanonizedList from '../../canonizedList/canonizedList';
import CreateTopic from '../../createTopic/createTopic';


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
          <Button type="link" className={styles.btnLogin}><i className="icon-user"></i> Login</Button>
          <Button className={styles.btnRegister}><i className="icon-user-plus"></i> Register</Button>
        </div>
      </Header>
      <SearchSection />
      <Row>
        <Col xs={24} md={12} lg={12} xl={8}>
          <CreateTopic />
        </Col>
        <Col xs={24} md={12} lg={12} xl={8}>
          <CanonizedList />
        </Col>
        <Col xs={24} md={12} lg={12} xl={8}>
          <HelpCard />
        </Col>
      </Row>

    </React.Fragment>
  );
};

export default LoggedOutHeader;
