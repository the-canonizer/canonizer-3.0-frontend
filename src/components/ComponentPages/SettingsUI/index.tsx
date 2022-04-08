import { useState, Fragment, useEffect } from "react";
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
import { useRouter } from "next/router";
import SocialOauth from "../socialAuthVerification";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";

const { TabPane } = Tabs;
const tabList = [
  {
    key: "profile_info",
    tab: "Profile Info",
  },
  {
    key: "social_oauth_verification",
    tab: "Social Oauth Verification",
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

export default function SettingsUI() {
  const [search, setSearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [activeTabKey, setActiveTabKey] = useState("profile_info");
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  const router = useRouter();

  const contentList = {
    profile_info: <ProfileInfo />,
    change_password: <ChangePassword />,
    nick_name: <NickName />,
    supported_camps: (
      <div className={styles.supported_camps}>
        <div className={styles.search_users}>
          <SearchOutlined />
          <input
            placeholder="Search by topic name"
            type="text"
            name="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <Tabs onChange={callback} type="card">
          <TabPane tab="Direct Supported Camps" key="1">
            <div className={styles.notes}>
              {" "}
              Note : To change support order of camp, drag & drop the camp box
              on your choice position.
            </div>
            <DirectSupportedCamps search={search} />
          </TabPane>
          <TabPane tab="Delegated Support Camps" key="2">
            <DelegatedSupportCamps search={search} />
          </TabPane>
        </Tabs>
      </div>
    ),
    social_oauth_verification: (
      <Fragment>
        <SocialOauth />
      </Fragment>
    ),
  };

  useEffect(() => {
    const query = router.query;
    if (query.tab === "social") {
      setActiveTabKey("social_oauth_verification");
    }
  }, [router.query]);

  return (
    <>
      <div>
        <div className={styles.card}>
          <div className={styles.btnsWrap}>
            <CreateNewCampButton />
          </div>
        </div>
        <div className="siteAds">
          src={"/images/Image37.jpg"}
          width={200}
          height={400}
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
