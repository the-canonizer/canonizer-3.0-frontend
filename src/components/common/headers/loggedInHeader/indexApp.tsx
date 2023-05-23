import React from "react";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation/indexApp";
import DisclaimerMsg from "../../disclaimer";

const LoggedInHeader = () => {
  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      <SearchSection />
      <DisclaimerMsg />
      <LoginModal />
      <RegistrationModal />
    </React.Fragment>
  );
};

export default LoggedInHeader;
