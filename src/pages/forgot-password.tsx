import { Card } from "antd";
import ForgotPassword from "../components/ComponentPages/ForgotPassword";

import GetStartedLayout from "../hoc/getStartedLayout";

const ForgotPasswordPage = () => {
  return (
    <GetStartedLayout routeName={"forgot-password"}>
      <Card bordered={false} className="login-container">
        <ForgotPassword isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

export default ForgotPasswordPage;
