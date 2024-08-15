import { Fragment } from "react";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Fragment>
      <div className="flex md:justify-between justify-between items-center h-20 z-10 w-100  relative">
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
