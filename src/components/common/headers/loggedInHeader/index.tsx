import React from "react";
import SearchSection from "../../searchSection";
// import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "src/components/ComponentPages/Registration/registrationModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation";
import DisclaimerMsg from "../../disclaimer";
import ArchivedCampMsg from "../../ArchivedCampMsg";
import TopicCreationBTN from "../TopicCreationBTN";
import HeaderMenu from "../HeaderMenu";
const LoggedInHeader = () => {
  const isMobile = window.matchMedia("(min-width: 1280px)").matches;
  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      {isMobile == false ? (
        <section className="Mob_View">
          <div className="search_header">
            <HeaderMenu isUserAuthenticated={undefined} />
          </div>
        </section>
      ) : (
        <></>
      )}
      {/* <SearchSection /> */}
      <div className="topicMobBTN">
        <TopicCreationBTN key="create-topic-area" />
      </div>
      <DisclaimerMsg />
      <ArchivedCampMsg />
      {/* <LoginModal /> */}
      <RegistrationModal />
    </React.Fragment>
  );
};

export default LoggedInHeader;
