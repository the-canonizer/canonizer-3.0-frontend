import { Fragment } from "react";
import { useRouter } from "next/router";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoggedOutHeader = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  const isTopicPage = router?.asPath === "/create/topic";

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
