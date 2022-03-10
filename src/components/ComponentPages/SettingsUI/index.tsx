import { useState } from "react";
import { Layout, Card, Col, Row, Button } from "antd";
import Image from "next/image";
import ChangePassword from "../ChangePassword";
import ProfileInfo from "../ProfileInfo";
import NickName from "../NickName";
import styles from "./Settings.module.scss";
import DirectSupportedCamps from "../DirectSupportedCamps";
import { SearchOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import DelegatedSupportCamps from "../DelegatedSupportCamps";

const { TabPane } = Tabs;
const tabList = [
  {
    key: "profile_info",
    tab: "Profile Info",
  },
  {
    key: "change_password",
    tab: "Change Password",
  },
  {
    key: "nick_name",
    tab: "Nick Names",
  },
  {
    key: "supported_camps",
    tab: "Supported Camps",
  },
];
function callback(key) {
  console.log(key);
}
const contentList = {
  profile_info: (
    <p>
      <ProfileInfo />{" "}
    </p>
  ),
  change_password: (
    <p>
      <ChangePassword />
    </p>
  ),
  nick_name: (
    <p>
      <NickName />
    </p>
  ),
  supported_camps: (
    <div className={styles.supported_camps}>
      <div className={styles.search_users}>
        <SearchOutlined />
        <input placeholder="Search by topic name" type="text" name="search" />
      </div>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Direct Supported Camps" key="1">
          <div className={styles.notes}>
            {" "}
            Note : To change support order of camp, drag & drop the camp box on
            your choice position.
          </div>
          <DirectSupportedCamps />
        </TabPane>
        <TabPane tab="Delegated Support Camps" key="2">
          <DelegatedSupportCamps />
        </TabPane>
      </Tabs>
    </div>
  ),
};

export default function SettingsUI() {
  const [activeTabKey, setActiveTabKey] = useState("profile_info");
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <>
      <div>
        <div className={styles.card}>
          <div className={styles.btnsWrap}>
            <Button size="large" className={styles.btn}>
              <i className="icon-topic"></i> Create New Topic
            </Button>
          </div>
        </div>
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/image11.jpg"}
            width={200}
            height={635}
          />
        </div>
      </div>
      <Row gutter={16} className={styles.accountSetting}>
        <Col xs={24} sm={24} xl={24}>
          <Card
            style={{ width: "100%" }}
            title="Account Settings"
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={(key) => {
              onTabChange(key);
            }}
            className="tab--card"
          >
            {contentList[activeTabKey]}
          </Card>
        </Col>
      </Row>
    </>
  );
}
