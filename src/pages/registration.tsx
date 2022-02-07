import { Card } from "antd";
import Registration from "../components/ComponentPages/Registration";
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
