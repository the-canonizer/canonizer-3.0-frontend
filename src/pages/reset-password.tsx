import Resetpassword from "../components/ComponentPages/ResetPassword";
import GetStartedLayout from "../hoc/getStartedLayout";
const ResetPasswordPage = () => {
  return (
    <GetStartedLayout routeName={"reset-password"}>
      <Resetpassword />
    </GetStartedLayout>
  );
};

export default ResetPasswordPage;
