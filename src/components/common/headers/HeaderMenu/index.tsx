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
import { useIsMobile } from "src/hooks/useIsMobile";

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
  const isMobile = useIsMobile();

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const [isGravatarImage, setIsGravatarImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isActive, setActive] = useState(false);

  const ListItem = ({ cls = "", ...props }) => (
    <li
      className={`flex-auto px-3 before:hidden after:hidden lg:before:block lg:after:block rounded-lg ${styles.listItem} ${cls}`}
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
      <Menu.Item key="0" className="hover:text-canHoverBlue">
        <Link href="/settings" passHref>
          <a className="text-sm font-medium hover:text-canHoverBlue">
            <SettingOutlined className="mr-1" />
            Account Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" className="hover:text-canHoverBlue">
        <Link href="/settings?tab=supported_camps" passHref>
          <a className="text-sm font-medium ">
            <CheckCircleOutlined className="mr-1" />
            Supported Camps
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="3"
        className="text-sm font-medium hover:text-canHoverBlue"
      >
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
        } shadow-md lg:shadow-none ${className} [:root:--canHoverBlue:text-canHoverBlue] ${
          isActive ? styles.open : ""
        }`}
      >
        <div className="flex lg:hidden justify-between items-center">
          <Logo />
          <Button
            size="middle"
            className="border-0 p-0 block lg:hidden ml-2"
            onClick={toggleMobNav}
            key="outnline-btn"
          >
            <CloseOutlined className="text-xl" />
          </Button>
        </div>
        {!isUserAuthenticated ? (
          <div className="flex lg:hidden justify-between items-center mt-5 overflow-hidden py-3 text-center gap-[30px]">
            <Link href="/register">
              <a className="h-[50px] leading-[0] flex items-center justify-center bg-canBlue hover:bg-canHoverBlue px-3 py-1 rounded-lg w-2/4 text-center text-sm font-medium font-inter text-white hover:text-white">
                Register
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
            <Link href="/login">
              <a className="h-[50px] leading-[0] flex items-center justify-center px-3 py-1 rounded-lg w-2/4 text-center text-sm font-medium font-inter text-canBlack border-2 border-canBlue hover:text-canBlue hover:border-canHoverBlue">
                Login
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
          </div>
        ) : (
          <Typography.Paragraph className="font-semibold mt-4 text-sm h-[30px] block lg:hidden">
            Hi {loggedInUser?.first_name}!
          </Typography.Paragraph>
        )}
        <ul className="flex text-sm font-inter font-medium flex-col lg:flex-row lg:items-center mt-4 lg:mt-0">
          <ListItem
            cls={`create-topic-header-link ${
              router?.asPath === "/create/topic" ? styles.active : ""
            } hidden lg:flex`}
            key="create-topic-li"
          >
            <CreateTopic
              className={
                isUserAuthenticated
                  ? `border-[1px] px-3 py-2 rounded-lg border-canBlue`
                  : `hover:text-canHoverBlue`
              }
              isWithIcon={isUserAuthenticated}
            />
          </ListItem>
          {menuItems?.map((item, idx) => {
            return (
              <ListItem
                cls={`${router?.asPath === item.link ? styles.active : ""} ${
                  item?.isMobile ? "block lg:hidden" : ""
                } ${
                  item.linkTitle?.toLowerCase() === "start a topic"
                    ? "create-topic-header-link"
                    : ""
                }`}
                key={item.id + "_" + item.link + "___" + idx}
              >
                <Link href={item.link}>
                  <a className="hover:text-canHoverBlue flex">
                    {isMobile ? (
                      <span className="block lg:hidden mr-2">{item?.icon}</span>
                    ) : null}
                    {item.linkTitle}
                  </a>
                </Link>
              </ListItem>
            );
          })}
          {isUserAuthenticated ? (
            <ListItem
              key="notification-li"
              cls="after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray] hidden lg:block after:!hidden"
            >
              <Notifications />
            </ListItem>
          ) : null}
          {isUserAuthenticated ? (
            <ListItem
              key="profile-li"
              cls="hidden lg:flex justify-center items-center !pr-0"
            >
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
            <ListItem key="Join-canonizer-li" cls="hidden lg:block">
              <JoinCanonizer className="py-3" />
            </ListItem>
          )}
        </ul>
      </nav>
      {isMobile ? (
        isUserAuthenticated ? (
          <Fragment>
            <div
              key="notification-li-mobile"
              className="block lg:hidden mr-3 md:ml-auto lg:ml-0"
            >
              <Notifications />
            </div>
            <div key="profile-li-mobile" className="block lg:hidden">
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
          </Fragment>
        ) : null
      ) : null}
      <Button
        size="middle"
        className="border-0 p-0 block -mt-2 lg:hidden ml-2 md:ml-0"
        onClick={toggleMobNav}
        key="outnline-btn"
      >
        <MenuOutlined className="text-xl" />
      </Button>
    </Fragment>
  );
};

export default HeaderMenu;
