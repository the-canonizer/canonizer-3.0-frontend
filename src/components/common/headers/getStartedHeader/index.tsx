import { useState } from "react";
import { Button, Layout } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "../siteHeader.module.scss";

import Logo from "../logoHeader";

const { Header } = Layout;

const GetStartedHeader = () => {
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

  return (
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
                <li key={item.id}>
                  <Link href={item.link}>{item.linkTitle}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className={styles.right}>
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
  );
};

export default GetStartedHeader;
