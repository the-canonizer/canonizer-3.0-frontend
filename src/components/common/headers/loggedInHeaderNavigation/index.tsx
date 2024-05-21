import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import styles from "../siteHeader.module.scss";

import { logout } from "../../../../network/api/userApi";
import { RootState } from "../../../../store";
import Logo from "../logoHeader";
import {
  MenuOutlined,
  CloseOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Notifications from "../notification";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getGravatarPicApi,
  getLists,
  markNotificationRead,
} from "src/network/api/notificationAPI";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import HeaderMenu from "../HeaderMenu";
import ProfileInfoTab from "./profileInfoTab";

const { Header } = Layout;

export const logOut = async (router) => {
  const res = await logout();

  if (res?.status_code === 200) {
    // router?.push("/", null, { shallow: true });
  }
};

const LoggedInHeaderNavigation = ({ isLoginPage = false }: any) => {
  const { loggedInUser, list } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    list: state.notifications.headerNotification.list,
  }));

  const { isUserAuthenticated } = useAuthentication();
  const [isGravatarImage, setIsGravatarImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loggedUser, setLoggedUser] = useState(loggedInUser);
  const [isActive, setActive] = useState(false);

  const toggleMobNav = () => {
    setActive(!isActive);
  };

  const getListData = async () => {
    if (isUserAuthenticated) {
      await getLists();
    }
  };

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;
  const isSmallMobile = window.matchMedia("(max-width: 575px)").matches;

  useEffect(() => {
    if (!list?.length) {
      getListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  const onNotifyClick = async (id) => {
    dispatch(setManageSupportStatusCheck(false));
    const res = await markNotificationRead(id);
    if (res && res.status_code === 200) {
      delete router?.query?.from;
      delete router?.query?.n_type;
      // router?.query.from = "";
      router?.replace(router);
    }
  };

  useEffect(() => {
    const q = router?.query;
    if (q?.from && q?.from.includes("notify_")) {
      const fArr = String(q?.from).split("_");
      if (+fArr[1]) {
        onNotifyClick(+fArr[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const onClick = ({ key }) => {
    if (key == 3) {
      logOut(router);
    }
  };

  const menu = (
    <Menu onClick={onClick} className={styles.menuItems}>
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

  const getGravatarImage = async (email) => {
    setLoadingImage(true);
    let data = await getGravatarPicApi(email);
    if (data?.status == 200) {
      setIsGravatarImage(true);
    }
    setLoadingImage(false);
  };

  useEffect(() => {
    setLoggedUser(loggedInUser);
    if (isUserAuthenticated && loggedInUser && !loggedInUser?.profile_picture) {
      getGravatarImage(loggedInUser?.email);
    }
    //eslint-disable-next-line
  }, [loggedInUser]);

  return (
    <Header className={`${styles.wrap} printHIde`}>
      <Logo />
      <div className={`${styles.navWrap} ${isActive && styles.showMobMenu}`}>
        <div className={styles.mobLogoIcon}>
          <Logo />
        </div>
        <Button
          size="large"
          className={`${styles.btnCloseMobMenu} mb-4 float-right`}
          onClick={toggleMobNav}
        >
          <CloseOutlined />
        </Button>

        {isMobile == true ? <HeaderMenu loggedUser={loggedUser} /> : <></>}

        {!isLoginPage ? (
          <Fragment>
            {!isMobile && <HeaderMenu loggedUser={loggedUser} />}

            {isSmallMobile && (
              <ProfileInfoTab
                isGravatarImage={isGravatarImage}
                loadingImage={loadingImage}
                loggedUser={loggedUser}
                toggleMobNav={toggleMobNav}
                logOut={logOut}
                isMobile={true}
              />
            )}
          </Fragment>
        ) : null}
      </div>

      <div
        className={`${styles.right} ${!isLoginPage ? styles.onlogin : ""}`}
        key="right-area"
      >
        {!isLoginPage ? (
          <ProfileInfoTab
            isGravatarImage={isGravatarImage}
            loadingImage={loadingImage}
            loggedUser={loggedUser}
            toggleMobNav={toggleMobNav}
            logOut={logOut}
            isMobile={false}
            menu={menu}
          />
        ) : null}
        <div className={styles.iconMobMenu}>
          {!isLoginPage ? (
            <div className={styles.mob_noti}>
              <Notifications />
            </div>
          ) : null}
          <Button size="middle" onClick={toggleMobNav} key="outnline-btn">
            <MenuOutlined />
          </Button>
        </div>
      </div>
      <div
        className={`${styles.mobNavBG} ${isActive && styles.mobNavBGshow}`}
        onClick={toggleMobNav}
        key="toggle-menu"
      ></div>
    </Header>
  );
};

export default LoggedInHeaderNavigation;
