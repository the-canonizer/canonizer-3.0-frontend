import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./HeaderMenu.module.scss";

import CreateTopic from "@/components/shared/Buttons/TopicCreationButton";
import JoinCanonizer from "@/components/shared/Buttons/JoinCanoizerButton";
import ProfileInfoTab from "./profileInfo";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Notifications from "../notification";
import { Menu } from "antd";
import {
  CheckCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { logout } from "src/network/api/userApi";
import { getGravatarPicApi } from "src/network/api/notificationAPI";

const menuItems = [
  {
    link: "/browse",
    linkTitle: "Browse",
    id: 1,
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
    id: 3,
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

  const ListItem = ({ cls = "", ...props }) => (
    <li className={`flex-auto px-3 ${styles.listItem} ${cls}`} key={props.key}>
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
    <Menu onClick={onClick} className="">
      <Menu.Item key="0">
        <Link href="/settings" passHref>
          <a>
            <SettingOutlined />
            Account Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Link href="/settings?tab=supported_camps" passHref>
          <a>
            <CheckCircleOutlined />
            Supported Camps
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <LogoutOutlined />
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Fragment>
      <nav className={`${styles.NavWrap} ${className}`}>
        <ul className="flex text-base font-inter font-medium ">
          <ListItem
            cls={`${router?.asPath === "/create/topic" ? styles.active : ""}`}
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
                cls={router?.asPath === item.link ? styles.active : ""}
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
              cls="after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray]"
            >
              <Notifications />
            </ListItem>
          ) : null}
          {isUserAuthenticated ? (
            <ListItem key="profile-li">
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
            <ListItem key="Join-canonizer-li">
              <JoinCanonizer />
            </ListItem>
          )}
        </ul>
      </nav>
    </Fragment>
  );
};

export default HeaderMenu;
