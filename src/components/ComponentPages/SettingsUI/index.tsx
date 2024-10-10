import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tabs,
  Input,
  MenuProps,
  Menu,
  Radio,
  Select,
} from "antd";
import { useRouter } from "next/router";
import Sider from "antd/lib/layout/Sider";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./Settings.module.scss";

import ChangePassword from "../ChangePassword";
import ProfileInfo from "../ProfileInfo";
import NickName from "../NickName";
import DirectSupportedCamps from "../DirectSupportedCamps";
import DelegatedSupportCamps from "../DelegatedSupportCamps";
import SocialOauth from "../socialAuthVerification";
import SubscriptionsList from "../SubscriptionsList";
import messages from "src/messages";
import ImageUploader from "../ImageUploader";
import { RootState } from "src/store";
import { GetUserProfileInfo, logout } from "src/network/api/userApi";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import ProfilePrefrences from "../Preference";

const { TabPane } = Tabs;

function callback() {}

export const logOut = async (_router) => {
  await logout();
};

const SettingsUI = () => {
  const [search, setSearch] = useState("");
  const [activeTabKey, setActiveTabKey] = useState("");
  const [showSupportedCampsTab, setshowSupportedCampsTab] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("Direct_Supported_Camps");
  const [getDataFromUserProfile, setGetDataFromUserProfile] = useState(null);

  const onTabChange = (key) => {
    setActiveTabKey(key);
    router?.push("/settings?tab=" + key);
  };

  const router = useRouter();
  type MenuItem = Required<MenuProps>["items"][number];

  const contentList = {
    profile_info: <ProfileInfo />,
    nick_name: <NickName />,
    user_preferences: <ProfilePrefrences />,
    change_password: <ChangePassword />,
    direct_supported_camps: <DirectSupportedCamps search={search} />,
    delegate_supported_camp: <DelegatedSupportCamps search={search} />,
    supported_camps: (
      <div className={styles.supported_camps}>
        <div className={styles.search_users}>
          <div className={styles.search_box}>
            <div className={styles.search01}>
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
    social_oauth_verification: <SocialOauth />,
    subscriptions: <SubscriptionsList />,
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
    } else {
      setActiveTabKey("profile_info");
    }
  }, [router?.query]);
  //default profile tab

  useEffect(() => {
    // Update the selected radio based on the URL path
    if (router.asPath.includes("direct_supported_camps")) {
      setSelectedValue("Direct_Supported_Camps");
    } else if (router.asPath.includes("delegate_supported_camp")) {
      setSelectedValue("Delegated_Supported_Camps");
    } else if (router.asPath.includes("social_oauth_verification")) {
      setSelectedValue("social_oauth_verification");
    } else if (router.asPath.includes("change_password")) {
      setSelectedValue("change_password");
    } else {
      setSelectedValue("profile_info");
    }
  }, [router.asPath]);
  const { tab } = router.query;
  useEffect(() => {
    // Set the correct tab based on the URL query parameter
    if (tab) {
      setshowSupportedCampsTab(true); // Show the tabs
      setSelectedTab(
        tab === "delegate_supported_camp"
          ? "Delegated_Supported_Camps"
          : "Direct_Supported_Camps"
      );
    }
  }, [tab]);

  // const handleChange2 = (e) => {
  //   const value = e.target.value;
  //   setSelectedValue(value);
  //   // Navigate to the corresponding page
  //   if (value === "Direct_Supported_Camps") {
  //     router.push("/settings?tab=direct_supported_camps");
  //   } else if (value === "Delegated_Supported_Camps") {
  //     router.push("/settings?tab=delegate_supported_camp");
  //   }
  // };

  // useEffect(() => {
  //   const savedValue = localStorage.getItem("selectedValue");
  //   if (savedValue) {
  //     setSelectedValue(savedValue);
  //   }
  // }, []);
  // const handleSavedValue = (value) => {
  //   setSelectedValue(value);
  //   localStorage.setItem("selectedValue", value);
  // };
  const onClick = () => {
    logOut(router);
  };

  const getMatchQuery = (tab) => {
    const q = router?.query;
    if (tab == "profile_info" && (q?.tab == "profile_info" || !q?.tab)) {
      return "listItemActive";
    } else if (q?.tab == tab) {
      return "listItemActive";
    }

    return null;
  };

  const items: MenuItem[] = [
    {
      key: "profile_info",
      itemIcon: (
        <Image
          src="/images/nickname-user-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=profile_info">
          <a>Personal Info</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("profile_info")}`,
    },
    {
      key: "nick_name",
      itemIcon: (
        <Image
          src="/images/nickname-user-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=nick_name">
          <a>Nicknames</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("nick_name")}`,
    },
    {
      key: "user_preferences",
      itemIcon: (
        <Image
          src="/images/preference-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=user_preferences">
          <a>Preferences</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("user_preferences")}`,
    },
    {
      key: "supported_camps",
      label: (
        <span className="flex justify-start gap-1">
          Supported Camps
          <Image src="/images/flagicon.svg" width={24} height={24} />
        </span>
      ),
      children: [
        {
          key: "direct_supported_camps",
          label: (
            <Link href="/settings?tab=direct_supported_camps">
              <a>Direct Supported Camps</a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("direct_supported_camps")}`,
        },
        {
          key: "delegate_supported_camp",
          label: (
            <Link href="/settings?tab=delegate_supported_camp">
              <a>Delegated Supported Camps</a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("delegate_supported_camp")}`,
        },
      ],
      className: `listItem ${getMatchQuery("supported_camps")}`,
    },
    {
      key: "subscriptions",
      itemIcon: (
        <Image
          src="/images/subscription-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=subscriptions">
          <a>My Subscriptions</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("subscriptions")}`,
    },
    {
      key: "account_settings",
      label: (
        <span className="flex justify-start gap-1">
          Account Settings
          <Image src="/images/setting-icon.svg" width={24} height={24} alt="" />
        </span>
      ),
      children: [
        {
          key: "social_oauth_verification",
          label: (
            <Link href="/settings?tab=social_oauth_verification">
              <a>Social Auth</a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("social_oauth_verification")}`,
        },
        {
          key: "change_password",
          label: (
            <Link href="/settings?tab=change_password">
              <a>Password</a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("change_password")}`,
        },
      ],
      className: `listItem ${getMatchQuery("account_settings")}`,
    },
  ];

  const handleTabChange = (e) => {
    const newTab = e.target.value;
    setSelectedTab(newTab);

    if (newTab === "Direct_Supported_Camps") {
      router.push("/settings?tab=direct_supported_camps");
    } else if (newTab === "Delegated_Supported_Camps") {
      router.push("/settings?tab=delegate_supported_camp");
    }
  };

  const getUesrPofileData = async () => {
    let res = await GetUserProfileInfo();
    setGetDataFromUserProfile(res?.data);
  };

  useEffect(() => {
    if (router?.pathname !== "/settings?tab=profile_info") {
      getUesrPofileData();
    }
  }, []);

  return (
    <div className="pageContentWrap flex lg:flex-row flex-col gap-10">
      <div className="bg-canGray rounded-xl min-h-[45rem] h-full lg:flex flex-col justify-between sticky top-0 flex-1 hidden ">
        <div>
          <div className="p-5 border-b border-canGrey2 flex mb-4">
            <SectionHeading title="PROFILE SETTING" icon={null} />
          </div>
          <Sider
            width={280}
            className="!bg-transparent [&_.ant-menu]:!bg-transparent  "
          >
            <Menu
              title="PROFILE SETTINGS"
              mode="inline"
              items={items}
              className="custom-menu"
              // defaultSelectedKeys={["1"]}
              // defaultOpenKeys={["sub1"]}
              // style={{ height: "100%", borderRight: 0 }}
              // activeKey=""
              // defaultActiveFirst
              // className="custom-menu w-full px-0 [&_.ant-menu]:!bg-transparent [&_.ant-menu-item]:bg-transparent [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item-selected]:!bg-canBlue
              // [&_.ant-menu-item-selected]:!bg-opacity-20 [&_.ant-menu-item-selected]:after:!hidden relative [&_.ant-menu-item]:after:!right-auto [&_.ant-menu-item]:after:!left-2 [&_.ant-menu-item]:after:content-[''] [&_.ant-menu-item]:!py-0 [&_.ant-menu-item]:!px-0 [&_.ant-menu-submenu-title]:!py-0 [&_.ant-menu-item]:!my-2 [&_.ant-menu-item]:first:!mt-0 [&_.ant-menu-submenu]:!my-2 [&_.ant-menu-submenu-title]:!px-0 [&_.ant-menu-item]:!rounded-lg [&_.ant-menu-sub>li]:!bg-transparent"
            />
          </Sider>
        </div>
        <footer className="px-9 py-10 flex justify-start border-t border-canGrey2">
          <p className="text-base font-semibold text-canDarkRed flex gap-2.5 items-center cursor-pointer">
            <span onClick={onClick}> Log Out</span>
            <Image
              src="/images/logout-icon.svg"
              width={24}
              height={24}
              alt=""
            />
          </p>
        </footer>
      </div>
      <div className="flex flex-col w-full">
        <div>
          <div className="">
            <div id="upload-profile">
              <div>
                <div className="">
                  <div
                    id="upload-profile"
                    className="flex flex-row  items-center justify-start lg:gap-8 gap-4 lg:bg-canGray py-2.5 lg:px-12 px-2 mb-4 rounded-xl"
                  >
                    <ImageUploader />
                    <div className="flex flex-col gap-1">
                      <h3 className="lg:text-xl text-base text-canBlack font-medium">
                        {getDataFromUserProfile?.first_name}{" "}
                        {getDataFromUserProfile?.last_name}
                      </h3>
                      <p className="text-sm font-normal text-canLight">
                        {getDataFromUserProfile?.email}
                      </p>
                    </div>
                  </div>
                  <div className=" ">
                    <div className="mb-10 flex flex-col lg:flex-row lg:hidden bg-canGray ml-[-1rem] mr-[-1rem] w-[calc(100%- -2rem)]">
                      <Select
                        className=" w-full !bg-canGray [&_.ant-select-selector]:!h-16 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-r-0 [&_.ant-select-selector]:!border-l-0 "
                        defaultValue="Select"
                        // value={selectedValue}
                        suffixIcon={
                          <Image
                            src="/images/caret-icon.svg"
                            width={16}
                            height={9}
                            alt=""
                          />
                        }
                        // onChange={handleSavedValue}
                        options={[
                          {
                            value: "Personal Info",
                            label: (
                              <span>
                                <Link
                                  href="/settings?tab=profile_info"
                                  className="[&_.ant-menu-item-selected]:!text-canBlue"
                                >
                                  <a className="flex items-center gap-3">
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Personal Info
                                    </span>
                                    <Image
                                      src="/images/nickname-user-icon.svg"
                                      width={14}
                                      height={24}
                                      alt=""
                                    />
                                  </a>
                                </Link>
                              </span>
                            ),
                          },
                          {
                            value: "Nicknames",
                            label: (
                              <span>
                                <Link
                                  href="/settings?tab=nick_name"
                                  className="[&_.ant-menu-item]:!rounded-lg"
                                >
                                  <a className="flex items-center gap-3">
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Nicknames
                                    </span>
                                    <Image
                                      src="/images/nickname-user-icon.svg"
                                      width={14}
                                      height={24}
                                      alt=""
                                    />
                                  </a>
                                </Link>
                              </span>
                            ),
                          },
                          {
                            value: "Preferences",
                            label: (
                              <span>
                                <Link href="/settings?tab=user_preferences">
                                  <a className="flex items-center gap-3">
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Preferences
                                    </span>
                                    <Image
                                      src="/images/preference-icon.svg"
                                      width={16}
                                      height={16}
                                      alt=""
                                    />
                                  </a>
                                </Link>
                              </span>
                            ),
                          },
                          {
                            value: "Supported Camps",
                            label: (
                              <span>
                                <a className="flex items-center gap-3">
                                  <button
                                    className="text-base font-medium text-canBlack"
                                    onClick={() => {
                                      setshowSupportedCampsTab(true);
                                      setSelectedTab("Direct_Supported_Camps");
                                      router.push(
                                        "/settings?tab=direct_supported_camps"
                                      );
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault(); // Prevent default action for space key
                                        setshowSupportedCampsTab(true);
                                        setSelectedTab(
                                          "Direct_Supported_Camps"
                                        );
                                        router.push(
                                          "/settings?tab=direct_supported_camps"
                                        );
                                      }
                                    }}
                                  >
                                    Supported Camps
                                  </button>
                                  <Image
                                    src="/images/flagicon.svg"
                                    width={24}
                                    height={24}
                                    alt=""
                                  />
                                </a>
                              </span>
                            ),
                          },
                          {
                            value: "Social Auth",
                            label: (
                              <span>
                                <Link
                                  href={
                                    "/settings?tab=social_oauth_verification"
                                  }
                                >
                                  <a className="flex items-center gap-3">
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Social Auth
                                    </span>
                                    <Image
                                      src="/images/setting-icon.svg"
                                      width={24}
                                      height={24}
                                      alt=""
                                    />
                                  </a>
                                </Link>
                              </span>
                            ),
                          },
                          {
                            value: "Change Password",
                            label: (
                              <span>
                                <Link href={"/settings?tab=change_password"}>
                                  <a className="flex items-center gap-3">
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Change Password
                                    </span>
                                    <Image
                                      src="/images/setting-icon.svg"
                                      width={24}
                                      height={24}
                                      alt=""
                                    />
                                  </a>
                                </Link>
                              </span>
                            ),
                          },
                        ]}
                      />
                    </div>
                    {showSupportedCampsTab &&
                      (router?.asPath ==
                        "/settings?tab=direct_supported_camps" ||
                        router?.asPath ==
                          "/settings?tab=delegate_supported_camp") && (
                        <div className="flex justify-between border-b border-canGrey2 mb-5 lg:hidden">
                          <Radio.Group
                            className="flex items-center justify-between py-5 gap-4 lg:ml-10"
                            value={selectedTab}
                            onChange={handleTabChange}
                          >
                            <Radio
                              value="Direct_Supported_Camps"
                              className="text-sm font-semibold"
                            >
                              Direct Supported Camps
                            </Radio>
                            <Radio
                              value="Delegated_Supported_Camps"
                              className="text-sm font-semibold"
                            >
                              Delegated Supported Camps
                            </Radio>
                          </Radio.Group>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:border border-canGrey2 rounded-xl lg:p-5">
          <Card
            data-testid="contentlist"
            style={{ width: "100%" }}
            // title="Account Settings"
            // tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={(key) => {
              onTabChange(key);
            }}
            className="border-0 tab--card  [&_.ant-card]:!border-none [&_.ant-card-body]:!p-0 "
          >
            {contentList[activeTabKey]}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default SettingsUI;
