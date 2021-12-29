import Resetpassword from "../components/ComponentPages/ResetPassword";
import GetStartedLayout from "../hoc/getStartedLayout";
const ResetPasswordPage = () => {
  const meta = {
    title: "Reset Password",
    description: "Reset canonizer login password ",
    route: "login",
  };
  return (
    <GetStartedLayout meta={meta}>
      <Resetpassword />
    </GetStartedLayout>
  );
};

export default ResetPasswordPage;
