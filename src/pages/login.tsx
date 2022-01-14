import GetStartedLayout from "../hoc/getStartedLayout";
import Login from "../components/ComponentPages/Login";
import { Card } from "antd";

const LoginPage = () => {
  return (
    <GetStartedLayout routeName={"login"}>
      <Card bordered={false} className="login-container">
        <Login />
      </Card>
    </GetStartedLayout>
  );
};

export default LoginPage;
