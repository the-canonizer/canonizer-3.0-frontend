import Resetpassword from "../components/ComponentPages/resetPassword";
import GetStartedLayout from "../hoc/getStartedLayout";
const ResetPasswordPage = () => {
  return (
    <GetStartedLayout routeName={"reset-password"}>
      <Resetpassword />
    </GetStartedLayout>
  );
};

export default ResetPasswordPage;
