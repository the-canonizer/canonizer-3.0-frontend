import Navigation from "../loggedInHeaderNavigation";
import { Fragment } from "react";
import DisclaimerMsg from "../../disclaimer";

const GetStartedHeader = () => {
  return (
    <Fragment>
      <Navigation isLoginPage={true} />
      <DisclaimerMsg />
    </Fragment>
  );
};

export default GetStartedHeader;
