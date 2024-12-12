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
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedValueFromSelectTag, setSelectedValueFromSelectTag] = useState("");

  const onTabChange = (key) => {
    setActiveTabKey(key);
    router?.push("/settings?tab=" + key);
  };

  const onOpenChange = (keys) => {
    // Handle the opening and closing of submenus
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
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
        {/* <div className={styles.search_users}>
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
        </div> */}

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
          id="menu_item_profile_info_icon"
          src="/images/nickname-user-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=profile_info">
          <a id="menu_item_profile_info_link">Personal Info</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("profile_info")}`,
    },
    {
      key: "nick_name",
      itemIcon: (
        <Image
          id="menu_item_nick_name_icon"
          src="/images/nickname-user-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=nick_name">
          <a id="menu_item_nick_name_link">Nicknames</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("nick_name")}`,
    },
    {
      key: "user_preferences",
      itemIcon: (
        <Image
          id="menu_item_user_preferences_icon"
          src="/images/preference-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=user_preferences">
          <a id="menu_item_user_preferences_link">Preferences</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("user_preferences")}`,
    },
    {
      key: "supported_camps",
      label: (
        <span
          id="menu_item_supported_camps_label"
          className="flex justify-start gap-1"
        >
          Supported Camps
          <Image
            id="menu_item_supported_camps_icon"
            src="/images/flagicon.svg"
            width={24}
            height={24}
          />
        </span>
      ),
      children: [
        {
          key: "direct_supported_camps",
          label: (
            <Link href="/settings?tab=direct_supported_camps">
              <a id="menu_item_direct_supported_camps_link">
                Direct Supported Camps
              </a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("direct_supported_camps")}`,
        },
        {
          key: "delegate_supported_camp",
          label: (
            <Link href="/settings?tab=delegate_supported_camp">
              <a id="menu_item_delegate_supported_camp_link">
                Delegated Supported Camps
              </a>
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
          id="menu_item_subscriptions_icon"
          src="/images/subscription-icon.svg"
          width={14}
          height={14}
          alt=""
        />
      ),
      label: (
        <Link href="/settings?tab=subscriptions">
          <a id="menu_item_subscriptions_link">My Subscriptions</a>
        </Link>
      ),
      className: `listItem ${getMatchQuery("subscriptions")}`,
    },
    {
      key: "account_settings",
      label: (
        <span
          id="menu_item_account_settings_label"
          className="flex justify-start gap-1"
        >
          Account Settings
          <Image
            id="menu_item_account_settings_icon"
            src="/images/setting-icon.svg"
            width={24}
            height={24}
            alt=""
          />
        </span>
      ),
      children: [
        {
          key: "social_oauth_verification",
          label: (
            <Link href="/settings?tab=social_oauth_verification">
              <a id="menu_item_social_oauth_verification_link">Social Auth</a>
            </Link>
          ),
          className: `subItem ${getMatchQuery("social_oauth_verification")}`,
        },
        {
          key: "change_password",
          label: (
            <Link href="/settings?tab=change_password">
              <a id="menu_item_change_password_link">Password</a>
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
console.log(router,"rout")
useEffect(() => {
  if (router.query.tab) {
    const tab = router.query.tab as string;
    switch (tab) {
      case "nick_name":
        setSelectedValueFromSelectTag("Nicknames");
        break;
      case "profile_info":
        setSelectedValueFromSelectTag("Personal Info");
        break;
      case "user_preferences":
        setSelectedValueFromSelectTag("Preferences");
        break;
      case "direct_supported_camps":
        setSelectedValueFromSelectTag("Supported Camps");
        break;
        case "delegate_supported_camp":
        setSelectedValueFromSelectTag("Supported Camps");
        break;
      case "social_oauth_verification":
        setSelectedValueFromSelectTag("Social Auth");
        break;
      case "change_password":
        setSelectedValueFromSelectTag("Change Password");
        break;
      default:
        setSelectedValueFromSelectTag(undefined);
    }
  }
}, [router.query.tab]);
  return (
    <div
      className="pageContentWrap flex lg:flex-row flex-col gap-10"
      id="setting_section"
    >
      <div
        className="bg-canGray rounded-xl min-h-[45rem] h-full lg:flex flex-col justify-between sticky top-0 flex-1 hidden "
        id="setting_section_sub"
      >
        <div id="setting_section_sub_1">
          <div
            className="p-5 border-b border-canGrey2 flex mb-4"
            id="setting_section_title"
          >
            <SectionHeading title="PROFILE SETTING" icon={null} />
          </div>
          <Sider
            id="setting_section_sider"
            width={280}
            className="!bg-transparent [&_.ant-menu]:!bg-transparent  "
          >
            <Menu
              id="setting_section_menu"
              title="PROFILE SETTINGS"
              mode="inline"
              items={items}
              className="custom-menu"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            />
          </Sider>
        </div>
        <footer
          className="px-9 py-10 flex justify-start border-t border-canGrey2"
          id="setting_section_footer"
        >
          <p
            className="text-base font-semibold text-canDarkRed flex gap-2.5 items-center cursor-pointer"
            id="setting_section_footer_log_out"
          >
            <span
              onClick={onClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault(); // Prevent scrolling when Space is pressed
                  onClick();
                }
              }}
              role="button"
              tabIndex={0}
              id="setting_section_log_out_text"
              style={{ cursor: "pointer" }}
            >
              Log Out
            </span>
            <Image
              id="setting_section_log_out_img"
              src="/images/logout-icon.svg"
              width={24}
              height={24}
              alt=""
            />
          </p>
        </footer>
      </div>
      <div className="flex flex-col w-full" id="setting_section_tab">
        <div id="setting_section_tab_sub">
          <div className="" id="setting_section_tab_sub_1">
            <div id="upload-profile">
              <div>
                <div className="" id="setting_section_tab_sub_2">
                  <div
                    id="setting_section_img_uploader"
                    className="flex flex-row  items-center justify-start lg:gap-8 gap-4 lg:bg-canGray py-2.5 lg:px-12 px-2 mb-4 rounded-xl"
                  >
                    <ImageUploader />
                    <div
                      className="flex flex-col gap-1"
                      id="setting_section_user_profile_details"
                    >
                      <h3
                        className="lg:text-xl text-base text-canBlack font-medium"
                        id="setting_section_user_profile_name"
                      >
                        {getDataFromUserProfile?.first_name}{" "}
                        {getDataFromUserProfile?.last_name}
                      </h3>
                      <p
                        className="text-sm font-normal text-canLight"
                        id="setting_section_user_profile_email"
                      >
                        {getDataFromUserProfile?.email}
                      </p>
                    </div>
                  </div>
                  <div className=" " id="setting_section_select_tag_parent">
                    <div
                      className="mb-10 flex flex-col lg:flex-row lg:hidden bg-canGray ml-[-1rem] mr-[-1rem] w-[calc(100%- -2rem)]"
                      id="setting_section_select_tag_sub_1"
                    >
                      <Select
                        id="setting_section_select_tag"
                        className=" w-full !bg-canGray [&_.ant-select-selector]:!h-16 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-r-0 [&_.ant-select-selector]:!border-l-0 [&_.ant-select-selection-item]:h-full [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!h-full
                         [&_.ant-select-selection-item]:!items-center "
                        // defaultValue="Select"
                        value={selectedValueFromSelectTag}
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
                              <span id="setting_section_select_tag_persnol_info" className="span_tagpersonal_info">
                                <Link
                                  href="/settings?tab=profile_info"
                                  className="[&_.ant-menu-item-selected]:!text-canBlue"
                                >
                                  <a
                                    className="flex items-center gap-3"
                                    id="setting_section_select_tag_persnol_info_link"
                                  >
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Personal Info
                                    </span>
                                    <Image
                                      id="setting_section_select_tag_persnol_info_img"
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
                              <span id="setting_section_select_tag_nickname" >
                                <Link
                                  href="/settings?tab=nick_name"
                                  className="[&_.ant-menu-item]:!rounded-lg"
                                >
                                  <a
                                    className="flex items-center gap-3"
                                    id="setting_section_select_tag_nickname_link"
                                  >
                                    <span
                                      className="text-base font-medium text-canBlack"
                                      id="setting_section_select_tag_nickname_text"
                                    >
                                      {" "}
                                      Nicknames
                                    </span>
                                    <Image
                                      id="setting_section_select_tag_nickname_img"
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
                              <span id="setting_section_select_tag_preferences">
                                <Link href="/settings?tab=user_preferences">
                                  <a
                                    className="flex items-center gap-3"
                                    id="setting_section_select_tag_preferences_link"
                                  >
                                    <span
                                      className="text-base font-medium text-canBlack"
                                      id="setting_section_select_tag_preferences_text"
                                    >
                                      {" "}
                                      Preferences
                                    </span>
                                    <Image
                                      id="setting_section_select_tag_preferences_img"
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
                              <span id="setting_section_select_tag_supported_camps"  className="span_tagpersonal_info">
                                <a
                                  className="flex items-center gap-3"
                                  id="setting_section_select_tag_supported_camps_all_link"
                                >
                                  <button
                                    id="setting_section_select_tag_supported_camps_btn"
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
                                    id="setting_section_select_tag_supported_camps_btn_img"
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
                              <span id="setting_section_select_tag_social_auth">
                                <Link
                                  href={
                                    "/settings?tab=social_oauth_verification"
                                  }
                                >
                                  <a
                                    className="flex items-center gap-3"
                                    id="setting_section_select_tag_social_auth_link"
                                  >
                                    <span className="text-base font-medium text-canBlack">
                                      {" "}
                                      Social Auth
                                    </span>
                                    <Image
                                      id="setting_section_select_tag_social_auth_img"
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
                              <span id="setting_section_select_tag_change_password">
                                <Link href={"/settings?tab=change_password"}>
                                  <a
                                    className="flex items-center gap-3"
                                    id="setting_section_select_tag_change_password_link"
                                  >
                                    <span
                                      className="text-base font-medium text-canBlack"
                                      id="setting_section_select_tag_change_password_text"
                                    >
                                      {" "}
                                      Change Password
                                    </span>
                                    <Image
                                      id="setting_section_select_tag_change_password_img"
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
                      (router?.asPath ===
                        "/settings?tab=direct_supported_camps" ||
                        router?.asPath ===
                          "/settings?tab=delegate_supported_camp") && (
                        <div className="flex justify-between border-b border-canGrey2 mb-5 lg:hidden">
                          <Radio.Group
                            id="setting_section_select_radio_grp"
                            className="flex items-center justify-between py-5 gap-4 lg:ml-10"
                            value={selectedTab}
                            onChange={handleTabChange}
                          >
                            <Radio
                              id="setting_section_select_radio_btn_direct_supported_camp"
                              value="Direct_Supported_Camps"
                              className="text-sm font-semibold"
                            >
                              Direct Supported Camps
                            </Radio>
                            <Radio
                              id="setting_section_select_radio_btn_delegate_supported_camp"
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
        <div
          className="lg:border border-canGrey2 rounded-xl lg:p-5"
          id="setting_section_card"
        >
          <Card
            id="setting_section_contentlist"
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
