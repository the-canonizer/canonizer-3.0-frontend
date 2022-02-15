import { useState } from "react";
import { Layout, Card, Col, Row, Button } from "antd";
import Image from "next/image";
import ChangePassword from "../ChangePassword";
import ProfileInfo from "../ProfileInfo";
import NickName from "../NickName";

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
  }
];

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
  )
};

export default function SettingsUI() {
  const [activeTabKey, setActiveTabKey] = useState("profile_info");
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <>

      <Layout>
        <Row className="main--layout">
          <Col span={5}>
            <Card>
              <Button size="large" className="createTopicBtn">
                <i className="icon-topic"></i>Create New Topic
              </Button>
            </Card>
            <div className="siteAds">
              <Image alt="adOne"
                src={'/images/image11.jpg'}
                width={200}
                height={635} />
            </div>
          </Col>
          <Col span={14}>
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
          <Col span={5}>
            <div className="siteAds">
              <Image alt="adtwo"
                src={'/images/image11.jpg'}
                width={200}
                height={635}
              />
            </div>
          </Col>
        </Row>
      </Layout>

    </>
  );
}
