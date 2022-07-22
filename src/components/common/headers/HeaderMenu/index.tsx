import React from "react";
import { Menu } from "antd";
import styles from "../siteHeader.module.scss";
import Link from "next/link";
const HeaderMenu = () => {
  return (
    <>
      {/* <nav className={styles.navWrap}>
        <Menu mode="horizontal" className={styles.nav}>
          <Menu.Item key={0}>
            <a href=""> Browse </a>
          </Menu.Item>
          <Menu.Item key={1}>
            <Link href="/uploadFiles">Upload Files</Link>
          </Menu.Item>
          <Menu.Item key={2}>
            <a href="">Help</a>
          </Menu.Item>
          <Menu.Item key={3}>
            <a href="/files/2012_amplifying_final.pdf" target="_blank">White Paper</a>
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
      </nav> */}
    </>
  );
};

export default HeaderMenu;
