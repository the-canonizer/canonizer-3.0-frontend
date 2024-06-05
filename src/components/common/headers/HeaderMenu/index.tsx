import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Menu } from "antd";
import {
  CheckCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import styles from "./HeaderMenu.module.scss";

import CreateTopic from "@/components/shared/Buttons/TopicCreationButton";
import JoinCanonizer from "@/components/shared/Buttons/JoinCanoizerButton";
import ProfileInfoTab from "./profileInfo";
import { RootState } from "src/store";
import Notifications from "../notification";
import { logout } from "src/network/api/userApi";
import { getGravatarPicApi } from "src/network/api/notificationAPI";

const menuItems = [
  {
    link: "/",
    linkTitle: "Home",
    id: 1,
    isMobile: true,
  },
  {
    link: "/browse",
    linkTitle: "Browse",
    id: 2,
  },
  {
    link: "/browse",
    linkTitle: "Start a Topic",
    id: 3,
    isMobile: true,
  },
  // {
  //   link: process.env.NEXT_PUBLIC_BLOG_URL,
  //   linkTitle: "Blog",
  //   id: 5,
  //   external: true,
  // },
  {
    link: "/topic/132-Help/1-Agreement?is_tree_open=1",
    linkTitle: "Help",
    id: 4,
  },
  {
    link: "/topic/132-Help/1-Agreement?is_tree_open=1",
    linkTitle: "Settings",
    id: 5,
    isMobile: true,
  },
];

export const logOut = async (router) => {
  const res = await logout();

  if (res?.status_code === 200) {
    router.push("/", null, { shallow: true });
  }
};

const HeaderMenu = ({ className = "", isUserAuthenticated }) => {
  const router = useRouter();

  const { loggedInUser, list } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    list: state.notifications.headerNotification.list,
  }));

  const [isGravatarImage, setIsGravatarImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isActive, setActive] = useState(false);

  const ListItem = ({ cls = "", ...props }) => (
    <li
      className={`flex-auto px-3 md:before:hidden md:after:hidden ${styles.listItem} ${cls}`}
      key={props.key}
    >
      {props?.children}
    </li>
  );

  const onClick = ({ key }) => {
    if (key == 3) {
      logOut(router);
    }
  };

  const getGravatarImage = async (email) => {
    setLoadingImage(true);
    let data = await getGravatarPicApi(email);
    if (data?.status == 200) {
      setIsGravatarImage(true);
    }
    setLoadingImage(false);
  };

  useEffect(() => {
    if (isUserAuthenticated && loggedInUser && !loggedInUser?.profile_picture)
      getGravatarImage(loggedInUser?.email);
  }, [loggedInUser]);

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="0" className="hover:text-hblue">
        <Link href="/settings" passHref>
          <a className="text-14 font-medium hover:text-hblue">
            <SettingOutlined className="mr-1" />
            Account Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" className="hover:text-hblue">
        <Link href="/settings?tab=supported_camps" passHref>
          <a className="text-14 font-medium ">
            <CheckCircleOutlined className="mr-1" />
            Supported Camps
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" className="text-14 font-medium hover:text-hblue">
        <LogoutOutlined className="mr-1" />
        Log Out
      </Menu.Item>
    </Menu>
  );

  const toggleMobNav = () => {
    setActive(!isActive);
  };

  return (
    <Fragment>
      <nav className={`${styles.NavWrap} md:shadow-md ${className}`}>
        <ul className="flex text-base font-inter font-medium md:flex-col">
          <ListItem
            cls={`${
              router?.asPath === "/create/topic" ? styles.active : ""
            } md:hidden`}
            key="create-topic-li"
          >
            <CreateTopic
              className={
                isUserAuthenticated
                  ? `border-[1px] px-3 py-2 rounded-lg border-blue`
                  : `hover:text-hblue`
              }
              isWithIcon={isUserAuthenticated}
            />
          </ListItem>
          {menuItems?.map((item, idx) => {
            return (
              <ListItem
                cls={`${router?.asPath === item.link ? styles.active : ""} ${
                  item?.isMobile ? "hidden md:block" : ""
                }`}
                key={item.id + "_" + item.link + "___" + idx}
              >
                <Link href={item.link}>
                  <a className="hover:text-hblue">{item.linkTitle}</a>
                </Link>
              </ListItem>
            );
          })}
          {isUserAuthenticated ? (
            <ListItem
              key="notification-li"
              cls="after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray] md:hidden"
            >
              <Notifications />
            </ListItem>
          ) : null}
          {isUserAuthenticated ? (
            <ListItem key="profile-li" cls="md:hidden">
              <ProfileInfoTab
                isGravatarImage={isGravatarImage}
                loadingImage={loadingImage}
                loggedUser={loggedInUser}
                toggleMobNav={""}
                logOut={""}
                isMobile={false}
                menu={menu}
              />
            </ListItem>
          ) : (
            <ListItem key="Join-canonizer-li" cls="md:hidden">
              <JoinCanonizer />
            </ListItem>
          )}
        </ul>
      </nav>
      {isUserAuthenticated ? (
        <div key="notification-li-mobile" className="hidden md:block mr-2">
          <Notifications />
        </div>
      ) : null}
      {isUserAuthenticated ? (
        <div key="profile-li-mobile" className="hidden md:block">
          <ProfileInfoTab
            isGravatarImage={isGravatarImage}
            loadingImage={loadingImage}
            loggedUser={loggedInUser}
            toggleMobNav={""}
            logOut={""}
            isMobile={false}
            menu={menu}
          />
        </div>
      ) : null}
      <Button
        size="middle"
        className="border-0 p-0 hidden md:block ml-2"
        onClick={toggleMobNav}
        key="outnline-btn"
      >
        <MenuOutlined className="text-medium" />
      </Button>
    </Fragment>
  );
};

export default HeaderMenu;
