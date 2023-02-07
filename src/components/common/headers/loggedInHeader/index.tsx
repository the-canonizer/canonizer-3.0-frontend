import React from "react";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation";
import DisclaimerMsg from "../../disclaimer";
// import SupportRemovedModal from "../../supportRemovedModal";

const LoggedInHeader = () => {
  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      <SearchSection />
      <DisclaimerMsg />
      <LoginModal />
      <RegistrationModal />
      {/* <SupportRemovedModal /> */}
    </React.Fragment>
  );
};

export default LoggedInHeader;
