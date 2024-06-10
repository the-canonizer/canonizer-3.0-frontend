import { useState, Fragment, useEffect } from "react";
import { Card, Button, Tabs, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import styles from "./Settings.module.scss";

import ChangePassword from "../ChangePassword";
import ProfileInfo from "../ProfileInfo";
import NickName from "../NickName";
import DirectSupportedCamps from "../DirectSupportedCamps";
import DelegatedSupportCamps from "../DelegatedSupportCamps";
import SocialOauth from "../socialAuthVerification";
import SubscriptionsList from "../SubscriptionsList";
import messages from "../../../messages";
import Sidebar from "../Home-old/SideBarNoFilter";

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
    tab: "Nicknames",
  },
  {
    key: "supported_camps",
    tab: "Supported Camps",
  },
  {
    key: "subscriptions",
    tab: "Subscriptions",
  },
];
function callback() {}

const SettingsUI = () => {
  const [search, setSearch] = useState("");
  const [activeTabKey, setActiveTabKey] = useState("");
  const onTabChange = (key) => {
    setActiveTabKey(key);
    router?.push("/settings?tab=" + key);
  };
  const router = useRouter();

  const contentList = {
    profile_info: <ProfileInfo />,
    change_password: <ChangePassword />,
    nick_name: <NickName />,
    supported_camps: (
      <div className={styles.supported_camps}>
        <div className={styles.search_users}>
          <div className={styles.search_box}>
            <div className={styles.search01}>
              <SearchOutlined />
              <Input
                data-testid="settingSearch"
                value={search}
                placeholder="Search by topic name"
                type="text"
                name="search"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Button
              data-testid="reset"
              onClick={() => setSearch("")}
              className={styles.btn}
            >
              Reset
            </Button>
          </div>
        </div>

        <Tabs onChange={callback} type="card" className={styles.supptab}>
          <TabPane tab="Direct Supported Camps" key="1">
            <div className={styles.text_checkbox_cont}>
              <div className={styles.notes}>{messages.labels.settingNote}</div>
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
    subscriptions: (
      <Fragment>
        <SubscriptionsList />
      </Fragment>
    ),
  };

  useEffect(() => {
    const query = router?.query;
    if (query && !query.tab) {
      setActiveTabKey("profile_info");
    } else if (query && query?.tab.includes("social")) {
      setActiveTabKey("social_oauth_verification");
    } else if (query && query?.tab.includes("profile")) {
      setActiveTabKey("profile_info");
    } else if (query && query.tab) {
      setActiveTabKey(query.tab.toString());
    }
  }, [router?.query]);

  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
        <Sidebar />
      </aside>
      <div className="pageContentWrap">
        <Card
          data-testid="contentlist"
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
      </div>
    </Fragment>
  );
};
export default SettingsUI;
