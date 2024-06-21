import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Menu, Typography } from "antd";
import {
  CheckCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  GlobalOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import styles from "./HeaderMenu.module.scss";

import CreateTopic from "src/components/shared/Buttons/TopicCreationButton";
import JoinCanonizer from "src/components/shared/Buttons/JoinCanoizerButton";
import ProfileInfoTab from "./profileInfo";
import { RootState } from "src/store";
import Notifications from "../notification";
import { logout } from "src/network/api/userApi";
import { getGravatarPicApi } from "src/network/api/notificationAPI";
import Logo from "../logoHeader";

const menuItems = [
  {
    link: "/",
    linkTitle: "Home",
    id: 1,
    isMobile: true,
    icon: <HomeOutlined />,
  },
  {
    link: "/browse",
    linkTitle: "Browse",
    id: 2,
    icon: <GlobalOutlined />,
  },
  {
    link: "/create/topic",
    linkTitle: "Start a Topic",
    id: 3,
    isMobile: true,
    icon: <PlusOutlined />,
  },
  // {
  //   link: process.env.NEXT_PUBLIC_BLOG_URL,
  //   linkTitle: "Blog",
  //   id: 5,
  //   external: true,
  // },
  {
    link: "/videos/consciousness",
    linkTitle: "Videos",
    id: 6,
    icon: <QuestionCircleOutlined />,
  },
  {
    link: "/topic/132-Help/1-Agreement?is_tree_open=1",
    linkTitle: "Help",
    id: 4,
    icon: <QuestionCircleOutlined />,
  },
  {
    link: "/settings",
    linkTitle: "Settings",
    id: 5,
    isMobile: true,
    icon: <SettingOutlined />,
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

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const [isGravatarImage, setIsGravatarImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isActive, setActive] = useState(false);

  const ListItem = ({ cls = "", ...props }) => (
    <li
      className={`flex-auto px-3 lg:before:hidden lg:after:hidden rounded-lg ${styles.listItem} ${cls}`}
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
      <nav
        className={`${
          styles.NavWrap
        } lg:shadow-md ${className} [:root:--hblue:text-hblue] ${
          isActive ? styles.open : ""
        }`}
      >
        <div className="hidden lg:flex justify-between items-center">
          <Logo />
          <Button
            size="middle"
            className="border-0 p-0 hidden lg:block ml-2"
            onClick={toggleMobNav}
            key="outnline-btn"
          >
            <CloseOutlined className="text-medium" />
          </Button>
        </div>
        {!isUserAuthenticated ? (
          <div className="hidden lg:flex justify-between items-center mt-5 overflow-hidden py-3 text-center gap-[30px]">
            <Link href="/register">
              <a className="h-[50px] leading-[0] flex items-center justify-center bg-blue hover:bg-hblue px-3 py-1 rounded-lg w-2/4 text-center text-14 font-medium font-inter text-white hover:text-white">
                Register
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
            <Link href="/login">
              <a className="h-[50px] leading-[0] flex items-center justify-center px-3 py-1 rounded-lg w-2/4 text-center text-14 font-medium font-inter text-black border-2 border-blue hover:text-blue hover:border-hblue">
                Login
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
          </div>
        ) : (
          <Typography.Paragraph className="font-medium text-14 h-[30px] hidden lg:block">
            Hi {loggedInUser?.first_name}!
          </Typography.Paragraph>
        )}
        <ul className="flex text-14 font-inter font-medium lg:flex-col lg:mt-4">
          <ListItem
            cls={`create-topic-header-link ${
              router?.asPath === "/create/topic" ? styles.active : ""
            } lg:hidden`}
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
                  item?.isMobile ? "hidden lg:block" : ""
                } ${
                  item.linkTitle?.toLowerCase() === "start a topic"
                    ? "create-topic-header-link"
                    : ""
                }`}
                key={item.id + "_" + item.link + "___" + idx}
              >
                <Link href={item.link}>
                  <a className="hover:text-hblue flex">
                    <span className="hidden lg:block mr-2">{item?.icon}</span>
                    {item.linkTitle}
                  </a>
                </Link>
              </ListItem>
            );
          })}
          {isUserAuthenticated ? (
            <ListItem
              key="notification-li"
              cls="after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray] lg:hidden"
            >
              <Notifications />
            </ListItem>
          ) : null}
          {isUserAuthenticated ? (
            <ListItem key="profile-li" cls="lg:hidden">
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
            <ListItem key="Join-canonizer-li" cls="lg:hidden">
              <JoinCanonizer />
            </ListItem>
          )}
        </ul>
      </nav>
      {isUserAuthenticated ? (
        <div
          key="notification-li-mobile"
          className="hidden lg:block mr-2 lg:ml-auto md:ml-1"
        >
          <Notifications />
        </div>
      ) : null}
      {isUserAuthenticated ? (
        <div key="profile-li-mobile" className="hidden lg:block">
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
        className="border-0 p-0 hidden lg:block lg:ml-auto md:ml-2"
        onClick={toggleMobNav}
        key="outnline-btn"
      >
        <MenuOutlined className="text-medium" />
      </Button>
    </Fragment>
  );
};

export default HeaderMenu;
