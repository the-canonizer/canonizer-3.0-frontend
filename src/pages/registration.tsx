import { Card } from "antd";
import Registration from "../components/componentPages/registration";
import GetStartedLayout from "../hoc/getStartedLayout";

const RegistrationPage = () => {
  return (
    <GetStartedLayout routeName={"registration"}>
      <Card bordered={false} className="login-container">
        <Registration isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

export default RegistrationPage;
