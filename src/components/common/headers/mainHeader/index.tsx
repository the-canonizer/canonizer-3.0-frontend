import { Fragment } from "react";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Fragment>
      <div className="flex justify-start items-center z-10 w-100 py-2">
        <Logo />
        <SearchHeader />
        <HeaderMenu
          className="ml-auto lg:ml-1"
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
