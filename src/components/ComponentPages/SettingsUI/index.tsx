import { useState, Fragment, useEffect } from "react";
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
import {
  AppstoreOutlined,
  CalendarOutlined,
  DesktopOutlined,
  FileOutlined,
  LaptopOutlined,
  LinkOutlined,
  MailOutlined,
  NotificationOutlined,
  PieChartOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import Sider from "antd/lib/layout/Sider";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ImageUploader from "../ImageUploader";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { logout } from "src/network/api/userApi";

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
export const logOut = async (_router) => {
  // const res =
  await logout();
};
const SettingsUI = () => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("");
  const [showSupportedCampsTab, setshowSupportedCampsTab] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("select");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("Direct_Supported_Camps");

  const onTabChange = (key) => {
    setActiveTabKey(key);
    router?.push("/settings?tab=" + key);
  };

  const { globalUserProfileData, globalUserProfileDataEmail } = useSelector(
    (state: RootState) => ({
      globalUserProfileData: state.topicDetails.globalUserProfileData,
      globalUserProfileDataEmail: state.topicDetails.globalUserProfileDataEmail,
    })
  );
  console.log(
    globalUserProfileData,
    globalUserProfileDataEmail,
    "abababababab;;;;;;;;;;;;;;;;;"
  );
  const router = useRouter();
  type MenuItem = Required<MenuProps>["items"][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  // const items: MenuItem[] = [
  //   getItem("Option 1", "1", <PieChartOutlined />),
  //   getItem("Option 2", "2", <DesktopOutlined />),
  //   getItem("User", "sub1", <UserOutlined />, [
  //     getItem("Tom", "3"),
  //     getItem("Bill", "4"),
  //     getItem("Alex", "5"),
  //   ]),
  //   getItem("Team", "sub2", <TeamOutlined />, [
  //     getItem("Team 1", "6"),
  //     getItem("Team 2", "8"),
  //   ]),
  //   getItem("Files", "9", <FileOutlined />),
  // ];

  const contentList = {
    profile_info: <ProfileInfo />,
    change_password: <ChangePassword />,
    nick_name: <NickName />,
    direct_supported_camps: <DirectSupportedCamps search={search} />,
    delegate_supported_camp: <DelegatedSupportCamps search={search} />,
    supported_camps: (
      <div className={styles.supported_camps}>
        <div className={styles.search_users}>
          <div className={styles.search_box}>
            <div className={styles.search01}>
              {/* <SearchOutlined /> */}
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

  const handleChange2 = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    // Navigate to the corresponding page
    if (value === "Direct_Supported_Camps") {
      router.push("/settings?tab=direct_supported_camps");
    } else if (value === "Delegated_Supported_Camps") {
      router.push("/settings?tab=delegate_supported_camp");
    }
  };
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
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    // Navigate to the corresponding page
    if (value === "social_oauth_verification") {
      router.push("/settings?tab=social_oauth_verification");
    } else if (value === "change_password") {
      router.push("/settings?tab=change_password");
    }
  };
  const callDirectSupportedCamps = () => {
    return (
      <>
        {router.push("/settings?tab=supported_camps")}
        <DirectSupportedCamps search={search} />
      </>
    );
  };
  const callDelegateSupportedCamps = () => {
    return (
      <>
        {router.push("/settings?tab=supported_camps")}
        <DelegatedSupportCamps search={search} />
      </>
    );
  };
  const items: MenuItem[] = [
    {
      key: "profile_info",
      label: (
        <span>
          <Link
            href="/settings?tab=profile_info"
            className="[&_.ant-menu-item-selected]:!text-canBlue"
          >
            <a
              className={`flex items-center gap-3   ${
                router?.asPath?.includes("profile_info")
                  ? "sample relative"
                  : ""
              }`}
            >
              <span className="text-base font-medium text-canBlack">
                {" "}
                Personal Info
              </span>
              <Image
                src="/images/nickname-user-icon.svg"
                width={14}
                height={24}
              />
            </a>
          </Link>
        </span>
      ),
    },
    {
      key: "nick_name",
      label: (
        <span>
          <Link
            href="/settings?tab=nick_name"
            className="[&_.ant-menu-item]:!rounded-lg"
          >
            <a
              className={`flex items-center gap-3    ${
                router?.asPath?.includes("nick_name") ? "sample relative" : ""
              }`}
            >
              <span className="text-base font-medium text-canBlack">
                {" "}
                Nicknames
              </span>
              <Image
                src="/images/nickname-user-icon.svg"
                width={14}
                height={24}
              />
            </a>
          </Link>
        </span>
      ),
    },
    {
      key: "change_password",
      label: (
        <span>
          <Link href="#">
            <a
              className={`flex items-center gap-3   ${
                router?.asPath?.includes("change_password")
                  ? "sample relative"
                  : ""
              }`}
            >
              <span className="text-base font-medium text-canBlack">
                {" "}
                Preferences
              </span>
              <Image src="/images/preference-icon.svg" width={16} height={16} />
            </a>
          </Link>
        </span>
      ),
    },

    {
      key: "supported_camps",
      label: (
        <span className="flex justify-between">
          <a className="flex items-center gap-3 ">
            <span className="text-base font-medium text-canBlack">
              {" "}
              Supported Camps
            </span>
            <Image src="/images/flagicon.svg" width={24} height={24} />
          </a>
          <Image
            src="/images/caret-icon.svg"
            className="account-arrow"
            width={16}
            height={9}
          />
        </span>
      ),
      children: [
        // { key: "3", label: "Direct" },
        {
          key: "4",
          label: (
            <Radio.Group
              onChange={handleChange2}
              value={selectedValue}
              className="flex flex-col py-5 gap-4 ml-10"
            >
              <Link href="/settings?tab=direct_supported_camps">
                <a className="!p-0">
                  <Radio
                    value="Direct_Supported_Camps"
                    className={`text-base text-canBlack font-medium ${
                      selectedValue === "Direct_Supported_Camps"
                        ? "text-canBlue"
                        : ""
                    }`}
                  >
                    Direct Supported Camps
                  </Radio>
                </a>
              </Link>
              <Link href="/settings?tab=delegate_supported_camp">
                <a className="!p-0">
                  <Radio
                    value="Delegated_Supported_Camps"
                    className={`text-base text-canBlack font-medium ${
                      selectedValue === "Delegated_Supported_Camps"
                        ? "text-canBlue"
                        : ""
                    }`}
                  >
                    Delegated Supported Camps
                  </Radio>
                </a>
              </Link>
            </Radio.Group>
          ),
        },
      ],
    },
    {
      key: "subscriptions",
      label: (
        <span className="flex justify-between">
          <Link href="/settings?tab=subscriptions">
            <a
              className={`flex items-center gap-3   ${
                router?.asPath?.includes("subscriptions")
                  ? "sample relative"
                  : ""
              }`}
            >
              <span className="text-base font-medium text-canBlack">
                {" "}
                My Subscriptions
              </span>
              <Image
                src="/images/subscription-icon.svg"
                width={24}
                height={24}
              />
            </a>
          </Link>
        </span>
      ),
    },
    {
      key: "Account settings",
      label: (
        <span className="flex justify-between">
          <a className="flex items-center gap-3">
            <span className="text-base font-medium text-canBlack">
              {" "}
              Account Settings
            </span>
            <Image src="/images/setting-icon.svg" width={24} height={24} />
          </a>
          <Image
            src="/images/caret-icon.svg"
            className="account-arrow"
            width={16}
            height={9}
          />
        </span>
      ),
      children: [
        {
          key: "3",
          label: (
            <Radio.Group
              onChange={handleChange}
              value={selectedValue}
              className="flex flex-col py-5 gap-4 ml-10"
            >
              <Radio
                value="social_oauth_verification"
                className={`text-base text-canBlack font-medium ${
                  selectedValue === "social_oauth_verification"
                    ? "text-canBlue"
                    : ""
                }`}
              >
                Social Auth
              </Radio>
              <Radio
                value="change_password"
                className={`text-base text-canBlack font-medium ${
                  selectedValue === "change_password" ? "text-canBlue" : ""
                }`}
              >
                Password
              </Radio>
            </Radio.Group>
          ),
        },
      ],
    },
    // {
    //   key: "6",
    //   label: (
    //     <span>
    //       <Link
    //         href="/settings?tab=profile_info"
    //         className="[&_.ant-menu-item-selected]:!font-semibold"
    //       >
    //         <a className="flex items-center gap-3">
    //           <span className="text-base font-medium text-canBlack">
    //             {" "}
    //             Account Settings
    //           </span>
    //           <Image src="/images/setting-icon.svg" width={24} height={24} />
    //         </a>
    //       </Link>
    //     </span>
    //   ),
    // },
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
  return (
    <Fragment>
      {/* <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
        <Sidebar />
      </aside> */}
      <div className="pageContentWrap flex lg:flex-row flex-col gap-10">
        {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={200}>
        <div className="demo-logo-vertical" />
        <Menu  defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider> */}
        <div className="bg-canGray  rounded-xl min-h-[45rem] h-full lg:flex flex-col justify-between sticky top-0  flex-1  hidden ">
          <div>
            <div className="p-5 border-b border-canGrey2 flex mb-10">
              <h3 className="uppercase text-base font-semibold">
                PROFILE SETTINGS
              </h3>
            </div>

            <Sider
              width={390}
              className="!bg-transparent [&_.ant-menu]:!bg-transparent  "
            >
              <Menu
                title="PROFILE SETTINGS"
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
                items={items}
                className="custom-menu w-full px-4 [&_.ant-menu]:!bg-transparent [&_.ant-menu-item]:bg-transparent [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item-selected]:!bg-canBlue
              [&_.ant-menu-item-selected]:!bg-opacity-20 [&_.ant-menu-item-selected]:after:!hidden relative [&_.ant-menu-item]:after:!right-auto [&_.ant-menu-item]:after:!left-2 [&_.ant-menu-item]:after:content-[''] [&_.ant-menu-item]:!py-0 [&_.ant-menu-item]:!px-0 [&_.ant-menu-submenu-title]:!py-0 [&_.ant-menu-item]:!my-5 [&_.ant-menu-item]:first:!mt-0 [&_.ant-menu-submenu]:!my-5  [&_.ant-menu-submenu-title]:!px-0 [&_.ant-menu-item]:!rounded-lg [&_.ant-menu-sub>li]:!bg-transparent [&_.ant-menu-submenu-arrow]:!hidden"
              />
            </Sider>
          </div>
          <footer className="px-9 py-10 flex justify-start border-t border-canGrey2">
            <p className="text-base font-semibold text-canDarkRed flex gap-2.5 items-center cursor-pointer">
              <span onClick={onClick}> LogOut</span>
              <Image src="/images/logout-icon.svg" width={24} height={24} />
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
                        <h3 className="lg:text-3xl text-base text-canBlack font-medium">
                          {globalUserProfileData}
                        </h3>
                        <p className="text-base font-medium text-canLight">
                          {globalUserProfileDataEmail}
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
                                  <Link href="#">
                                    <a className="flex items-center gap-3">
                                      <span className="text-base font-medium text-canBlack">
                                        {" "}
                                        Preferences
                                      </span>
                                      <Image
                                        src="/images/preference-icon.svg"
                                        width={16}
                                        height={16}
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
                                    <span
                                      className="text-base font-medium text-canBlack"
                                      onClick={() => {
                                        setshowSupportedCampsTab(true);
                                        setSelectedTab(
                                          "Direct_Supported_Camps"
                                        );
                                        router.push(
                                          "/settings?tab=direct_supported_camps"
                                        );
                                      }}
                                    >
                                      Supported Camps
                                    </span>
                                    <Image
                                      src="/images/flagicon.svg"
                                      width={24}
                                      height={24}
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
                                      />
                                    </a>
                                  </Link>
                                </span>
                              ),
                            },
                          ]}
                        />
                      </div>
                      {showSupportedCampsTab && (router?.asPath == "/settings?tab=direct_supported_camps" || router?.asPath == "/settings?tab=delegate_supported_camp" ) && (
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
          {/* <div className="lg:border border-canGrey2 rounded-xl lg:p-8 p-2.5"> */}
          <div className="lg:border border-canGrey2 rounded-xl lg:p-8">
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
    </Fragment>
  );
};
export default SettingsUI;
