import Navigation from "../loggedInHeaderNavigation";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import { Fragment } from "react";

const GetStartedHeader = () => {
  return (
    <Fragment>
      <Navigation isLoginPage={true} />
      <RegistrationModal />
    </Fragment>
  );
};

export default GetStartedHeader;
