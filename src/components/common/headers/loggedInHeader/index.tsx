import React from "react";
import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation";
import DisclaimerMsg from "../../disclaimer";
import ArchivedCampMsg from "../../ArchivedCampMsg";
import TopicCreationBTN from "../TopicCreationBTN";
import HeaderMenu from "../HeaderMenu";
const LoggedInHeader = () => {
  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      <section className="Mob_View">
        <div className="search_header">
          <HeaderMenu />
        </div>
      </section>
      <SearchSection />
      <div className="topicMobBTN">
        <TopicCreationBTN key="create-topic-area" />
      </div>
      <DisclaimerMsg />
      <ArchivedCampMsg />
      <LoginModal />
    </React.Fragment>
  );
};

export default LoggedInHeader;
