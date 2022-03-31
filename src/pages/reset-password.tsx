import Resetpassword from "../components/ComponentPages/ResetPassword";
import Layout from "../hoc/layout";

const ResetPasswordPage = () => {
  return (
    <Layout routeName={"reset-password"}>
      <Resetpassword />
    </Layout>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";

export default ResetPasswordPage;
