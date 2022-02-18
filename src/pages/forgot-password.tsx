import ForgotPassword from "../components/ComponentPages/ForgotPassword";

import GetStartedLayout from "../hoc/getStartedLayout";

const ForgotPasswordPage = () => {
  return (
    <GetStartedLayout routeName={"forgot-password"}>
      <ForgotPassword isModal={false} />
    </GetStartedLayout>
  );
};

export default ForgotPasswordPage;
