import ForgotPassword from "../components/ComponentPages/forgotPassword";

import GetStartedLayout from "../hoc/getStartedLayout";

const ForgotPasswordPage = () => {
  return (
    <GetStartedLayout routeName={"forgot-password"}>
      <ForgotPassword />
    </GetStartedLayout>
  );
};

export default ForgotPasswordPage;
