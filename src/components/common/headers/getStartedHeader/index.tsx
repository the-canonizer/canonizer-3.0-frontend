import Navigation from "../loggedInHeaderNavigation";
import RegistrationModal from "../../../ComponentPages/Registration/registrationModal";
import { Fragment } from "react";
import DisclaimerMsg from "../../disclaimer";

const GetStartedHeader = () => {
  return (
    <Fragment>
      <Navigation isLoginPage={true} />
      <DisclaimerMsg />
      <RegistrationModal />
    </Fragment>
  );
};

export default GetStartedHeader;
