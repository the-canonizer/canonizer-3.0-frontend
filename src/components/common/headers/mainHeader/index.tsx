import { Fragment } from "react";
import { useRouter } from "next/router";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  const router = useRouter();

  return (
    <Fragment>
      <div className="flex z-10 w-100 h-20 items-center">
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
