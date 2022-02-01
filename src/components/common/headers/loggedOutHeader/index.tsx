import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Layout, Menu, Row, Col } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import styles from "../siteHeader.module.scss";

import SearchSection from "../../search/search";

const LoggedOutHeader = () => {
  const { Header } = Layout;
  const router = useRouter();
  
  const [isActive, setActive] = useState(false);
  const toggleMobNav = () => {
    setActive(!isActive);
  };

  return (
    <React.Fragment>
      <Header className={styles.wrap}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src={"/images/logo.svg"} alt="Picture of the author" layout='responsive' width={225} height={42} />
            {/* <img src={"/images/logo.svg"} alt="Canonizer" /> */}
          </Link>
        </div>
        <div className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}>
          <Button block size="large" className={`${styles.btnCloseMobMenu} mb-4`} onClick={toggleMobNav}><i className='icon-angle-right'></i></Button>
          <nav className={styles.nav}>
            <ul>
              <li className={router.asPath === '/browse' ? styles.active : ''}>
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
        </div>
        <div className={styles.right}>
          <Button type="link" className={styles.btnLogin}>
            <i className="icon-user"></i> Login
          </Button>
          <Button className={styles.btnRegister}>
            <i className="icon-user-plus"></i> Register
          </Button>
          <div className={styles.iconMobMenu}>
            <Button size='large' onClick={toggleMobNav}><MenuOutlined /></Button>
          </div>
        </div>
        <div className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`} onClick={toggleMobNav}></div>
      </Header>
      <SearchSection />
    </React.Fragment>
  );
};

export default LoggedOutHeader;
