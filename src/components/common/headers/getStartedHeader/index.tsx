import { Layout } from "antd";

import styles from "../siteHeader.module.scss";

import Logo from "../logoHeader";

const { Header } = Layout;

const GetStartedHeader = () => {
  return (
    <Header className={styles.wrap}>
      <Logo />
    </Header>
  );
};

export default GetStartedHeader;
