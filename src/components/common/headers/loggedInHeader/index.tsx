import React from "react";
import SearchSection from "../../searchSection";
import LoginModal from "../../../componentPages/Login/loginModal";
import RegistrationModal from "../../../componentPages/registration/registrationModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation";

const LoggedInHeader = () => {
  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      <SearchSection />
      <LoginModal />
      <RegistrationModal />
    </React.Fragment>
  );
};

export default LoggedInHeader;
