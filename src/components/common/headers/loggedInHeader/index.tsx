import React from "react";
import { useRouter } from "next/router";

// import SearchSection from "../../searchSection";
import LoginModal from "../../../ComponentPages/Login/loginModal";
import RegistrationModal from "src/components/ComponentPages/Registration/registrationModal";
import LoggedInHeaderNavigation from "../loggedInHeaderNavigation";
import DisclaimerMsg from "../../disclaimer";
import ArchivedCampMsg from "../../ArchivedCampMsg";
import TopicCreationBTN from "../TopicCreationBTN";
import HeaderMenu from "../HeaderMenu";

const LoggedInHeader = () => {
  const router = useRouter();

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <React.Fragment>
      <LoggedInHeaderNavigation></LoggedInHeaderNavigation>
      {isMobile == false ? (
        <section className="Mob_View">
          <div className="search_header">
            <HeaderMenu />
          </div>
        </section>
      ) : (
        <></>
      )}
      {/* <SearchSection /> */}
      {!router?.asPath?.includes("/create/topic") ? (
        <div className="topicMobBTN">
          <TopicCreationBTN key="create-topic-area" />
        </div>
      ) : null}
      <DisclaimerMsg />
      <ArchivedCampMsg />
      <LoginModal />
      <RegistrationModal />
    </React.Fragment>
  );
};

export default LoggedInHeader;
