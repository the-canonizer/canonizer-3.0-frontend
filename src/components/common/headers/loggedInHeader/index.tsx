import React from "react";
import SearchSection from "../../search/search";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
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
