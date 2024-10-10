import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getNotificationsList,
  markNotificationRead,
} from "src/network/api/notificationAPI";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const LoggedOutHeader = () => {
  const { list } = useSelector((state: RootState) => {
    return {
      list: state.notifications.headerNotification.list,
    };
  });

  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

  const isTopicPage = router?.asPath === "/create/topic";

  const onNotifyClick = async (id: number) => {
    const res = await markNotificationRead(id);
    if (res && res.status_code === 200) {
      delete router?.query?.from;
      delete router?.query?.n_type;
      router?.replace(router, null, { shallow: true });
    }
  };

  useEffect(() => {
    const { from } = router.query;
    if (from) {
      if (from.includes("notify_")) {
        const fArr = String(from).split("_");
        if (+fArr[1]) {
          onNotifyClick(+fArr[1]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    const getList = async () => {
      await getNotificationsList();
    };

    if (
      isUserAuthenticated &&
      router?.asPath !== "/notifications" &&
      !(list.length > 0)
    ) {
      getList();
    }
  }, [isUserAuthenticated, router?.asPath]);

  return (
    <Fragment>
      <div
        className={`flex md:justify-between justify-between items-center h-20 z-10 w-100 relative ${
          isTopicPage ? "[&_.create-topic-header-link]:!hidden" : ""
        }`}
      >
        <Logo />
        <SearchHeader />
        <HeaderMenu
          className="ml-1 tab:ml-auto"
          isUserAuthenticated={isUserAuthenticated}
        />
      </div>

      {/* <SearchSection /> */}
      {/* <DisclaimerMsg />
      <ArchivedCampMsg />
      <LoginModal />
      <RegistrationModal />
      <ForgotModal /> */}
    </Fragment>
  );
};

export default LoggedOutHeader;
