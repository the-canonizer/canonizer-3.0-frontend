import { Card } from "antd";

import GetStartedLayout from "../hoc/getStartedLayout";
import Login from "../components/componentPages/Login";

const LoginPage = () => {
  return (
    <GetStartedLayout routeName={"login"}>
      <Card bordered={false} className="login-container">
        <Login isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

export default LoginPage;
