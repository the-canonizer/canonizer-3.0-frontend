import {
  ArrowRightOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  GlobalOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./HeaderMenu.module.scss";

import JoinCanonizer from "src/components/shared/Buttons/JoinCanoizerButton";
import CreateTopic from "src/components/shared/Buttons/TopicCreationButton";
import { useIsMobile } from "src/hooks/useIsMobile";
import { getGravatarPicApi } from "src/network/api/notificationAPI";
import { logout } from "src/network/api/userApi";
import { RootState, store } from "src/store";
import Logo from "../logoHeader";
import Notifications from "../notification";
import ProfileInfoTab from "./profileInfo";
import { setLogOutType } from "src/store/slices/authSlice";
import TourGuide from "components/common/tourGuide";
import {
  detailPageSteps,
  homePageSteps,
  navBarSteps,
  searchBar,
} from "src/constants/tourGuideSteps";
import { getGravatarImage } from "components/shared/AvaratGroup/avatar";

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
    link: "/uploadFile",
    linkTitle: "Upload File",
    id: 3,
    icon: <UploadOutlined />,
  },
  {
    link: "/videos",
    linkTitle: "Videos",
    id: 6,
    icon: <PlayCircleOutlined />,
  },
  {
    link: "/topic/132-Help/1-Agreement?is_tree_open=1",
    linkTitle: "Help",
    id: 4,
    icon: <QuestionCircleOutlined />,
  },
  {
    link: "/login",
    linkTitle: "Login",
    id: 19,
    icon: <LockOutlined />,
    hideOnLogin: true,
  },
  {
    link: "/notifications",
    linkTitle: "Notifications",
    id: 10,
    icon: <BellOutlined />,
    isAuthReq: true,
    isMobile: true,
  },
  {
    link: "/settings?tab=profile_info",
    linkTitle: "Account Settings",
    id: 5,
    isMobile: true,
    icon: <SettingOutlined />,
    isAuthReq: true,
  },
  {
    link: "/settings?tab=direct_supported_camps",
    linkTitle: "Supported Camps",
    id: 5,
    isMobile: true,
    icon: <CheckCircleOutlined />,
    isAuthReq: true,
  },
];

export const logOut = async (router) => {
  store.dispatch(setLogOutType("user"));

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

  const [isGravatarImage, setIsGravatarImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isActive, setActive] = useState(false);

  const ListItem = ({ cls = "", ...props }) => (
    <li
      className={`flex-auto flex px-3 font-medium [&_a]:font-medium before:hidden after:hidden tab:before:block tab:after:block rounded-lg h-full ${styles.listItem} ${cls}`}
      key={props.key}
      id={`list-item-${props.key}`}
    >
      {props?.children}
      <div className={styles.divider} id={`divider-${props.key}`}></div>
    </li>
  );
  const onClick = ({ key }) => {
    if (key == 3) {
      logOut(router);
      document.cookie =
        "current_user=" +
        "" +
        "; expires=Thu, 15 Jul 2030 00:00:00 UTC; path=/";

      document.cookie =
        "isUserAuthenticated=" +
        false +
        "; expires=Thu, 15 Jul 2030 00:00:00 UTC; path=/";
      console.log("logout");
    }
  };

  useEffect(() => {
    const fetchGravatarImage = async () => {
      if (isUserAuthenticated && loggedInUser && !loggedInUser?.profile_picture){
        setLoadingImage(true);
        const res = await getGravatarImage(loggedInUser?.email);
        if (res) {
          setIsGravatarImage(res);  // Set Gravatar image if found
        } else {
          setIsGravatarImage(false);  // Fallback to initials if Gravatar not found
        }
        setLoadingImage(false);
      }
    };
    fetchGravatarImage();
  }, [loggedInUser, isUserAuthenticated]);

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="0" className="hover:text-canHoverBlue" id="menu-item-0">
        <Link href="/settings?tab=profile_info" passHref>
          <a
            className="!text-sm font-normal hover:text-canHoverBlue"
            id="link-profile-info"
          >
            <SettingOutlined className="mr-1" />
            Account Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider id="menu-divider-0" />
      <Menu.Item key="1" className="hover:text-canHoverBlue" id="menu-item-1">
        <Link href="/settings?tab=direct_supported_camps" passHref>
          <a className="!text-sm font-normal" id="link-supported-camps">
            <CheckCircleOutlined className="mr-1" />
            Supported Camps
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider id="menu-divider-1" />
      <Menu.Item
        key="3"
        className="!text-sm font-normal hover:text-canHoverBlue"
        id="menu-item-3"
      >
        <LogoutOutlined className="mr-1" />
        Log Out
      </Menu.Item>
    </Menu>
  );

  const toggleMobNav = () => {
    setActive(!isActive);
  };

  const onSignOutClick = (e) => {
    e?.preventDefault();
    logOut(router);
  };

  return (
    <Fragment>
      {!isMobile && (
        <TourGuide
          steps={[
            ...searchBar,
            ...navBarSteps,
            ...homePageSteps,
            ...detailPageSteps,
          ]}
          cookieKey="homePageTour"
        />
      )}
      <nav
        id="nav-wrap"
        className={`${
          styles.NavWrap
        } shadow-md tab:shadow-none ${className} [:root:--canHoverBlue:text-canHoverBlue] ${
          isActive ? styles.open : ""
        }`}
      >
        <div
          id="nav-header"
          className="flex tab:hidden justify-between items-center"
        >
          <Logo />
          <Button
            id="close-button"
            size="middle"
            className="border-0 p-0 block tab:hidden ml-2"
            onClick={toggleMobNav}
            key="outnline-btn"
          >
            <CloseOutlined className="text-xl" />
          </Button>
        </div>
        {!isUserAuthenticated ? (
          <div
            id="auth-buttons"
            className="flex tab:hidden justify-between items-center mt-5 overflow-hidden py-3 text-center gap-[30px]"
          >
            <Link href="/registration">
              <a
                id="register-link"
                className="h-[50px] leading-[0] flex items-center justify-center bg-canBlue hover:bg-canHoverBlue px-3 py-1 rounded-lg w-2/4 text-center text-sm font-medium font-inter text-white hover:text-white"
              >
                Register
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
            <Link href="/login">
              <a
                id="login-link"
                className="h-[50px] leading-[0] flex items-center justify-center px-3 py-1 rounded-lg w-2/4 text-center text-sm font-medium font-inter text-canBlack border-2 border-canBlue hover:text-canBlue hover:border-canHoverBlue"
              >
                Login
                <ArrowRightOutlined className="ml-2" />
              </a>
            </Link>
          </div>
        ) : null}
        <ul
          id="menu-list"
          className="flex text-sm font-inter font-medium flex-col tab:flex-row tab:items-center mt-4 tab:mt-0 items-center"
        >
          <ListItem
            cls={`create-topic-header-link relative ${
              router?.asPath === "/create/topic" ? styles.active : ""
            } ${isMobile ? "mb-5 !pl-0" : ""} ${
              isUserAuthenticated
                ? ""
                : "after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray] flex after:top-0 after:right-0 after:left-auto"
            }`}
            key="create-topic-li"
          >
            <CreateTopic
              className={
                isUserAuthenticated
                  ? `border-[1px] px-3 py-2 rounded-lg border-canBlue bg-[#98B7E61A] ${
                      isMobile ? "bg-canBlue text-white rounded-lg" : ""
                    }`
                  : `hover:text-canHoverBlue] ${
                      isMobile
                        ? "bg-canBlue text-white rounded-lg px-3 py-2"
                        : ""
                    }`
              }
              isWithIcon={isUserAuthenticated}
            />
          </ListItem>
          {menuItems?.map((item, idx) => {
            return (
              <ListItem
                cls={`${router?.asPath === item.link ? styles.active : null} ${
                  item?.isMobile ? "flex tab:hidden" : null
                } ${
                  item.linkTitle?.toLowerCase() === "start a topic"
                    ? "create-topic-header-link"
                    : null
                } ${
                  isUserAuthenticated &&
                  item.linkTitle?.toLowerCase() === "browse"
                    ? "before:!hidden after:!hidden"
                    : null
                } ${
                  item?.isAuthReq && !isUserAuthenticated ? "hidden" : null
                } ${
                  item?.hideOnLogin && isUserAuthenticated ? "hidden" : null
                }`}
                key={item.id + "_" + item.link + "___" + idx}
              >
                <Link href={item.link}>
                  <a
                    id={`menu-item-${item.id}`}
                    className="hover:text-canHoverBlue flex"
                  >
                    {isMobile ? (
                      <span className="block tab:hidden mr-2">
                        {item?.icon}
                      </span>
                    ) : null}
                    {item.linkTitle}
                  </a>
                </Link>
              </ListItem>
            );
          })}
          {isUserAuthenticated ? (
            <ListItem
              key="notifications-li"
              cls="after:content-['|'] after:absolute after:ml-[10px] after:text-[darkgray] hidden tab:flex after:right-0"
            >
              <Notifications />
            </ListItem>
          ) : null}
          {isUserAuthenticated ? (
            <ListItem
              key="profile-li"
              cls="hidden tab:flex justify-center items-center !pr-0"
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
            <ListItem key="Join-canonizer-li" cls="hidden tab:flex">
              <JoinCanonizer className="py-3" />
            </ListItem>
          )}
        </ul>
        {isMobile && isUserAuthenticated ? (
          <div
            id="mobile-profile"
            className="mt-auto flex justify-between items-center"
          >
            <div className="flex items-center">
              <ProfileInfoTab
                isGravatarImage={isGravatarImage}
                loadingImage={loadingImage}
                loggedUser={loggedInUser}
                toggleMobNav={""}
                logOut={""}
                isMobile={false}
                menu={menu}
                withoutDropdown={true}
              />
              <div id="user-info" className="ml-3">
                <Typography.Paragraph
                  id="user-name"
                  className="font-medium text-canBlack !mb-0 text-sm h-auto block tab:hidden"
                >
                  {loggedInUser?.first_name} {loggedInUser?.last_name}
                </Typography.Paragraph>
                <Typography.Paragraph
                  id="user-email"
                  className="font-medium text-canLight !mb-0 text-xs h-auto block tab:hidden"
                >
                  {loggedInUser?.email}
                </Typography.Paragraph>
              </div>
            </div>
            <Button
              id="sign-out-button"
              type="link"
              className="bg-[#E46B6B1A] text-canRed flex items-center justify-center"
              onClick={onSignOutClick}
            >
              <LogoutOutlined className="text-lg" />
            </Button>
          </div>
        ) : null}
      </nav>
      <Button
        id="menu-toggle-button"
        size="middle"
        className="border-0 p-0 block -mt-2 tab:hidden ml-2 tab:ml-auto"
        onClick={toggleMobNav}
        key="outnline-btn"
      >
        <MenuOutlined className="text-xl" />
      </Button>
    </Fragment>
  );
};

export default HeaderMenu;
