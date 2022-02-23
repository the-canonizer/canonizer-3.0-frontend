import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";

import Registration from "../components/ComponentPages/Registration";
import GetStartedLayout from "../hoc/getStartedLayout";
import useAuthentication from "../hooks/isUserAuthenticated";

const RegistrationPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();
  useEffect(() => {
    isUserAuthenticated && router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <GetStartedLayout routeName={"registration"}>
      <Card bordered={false} className="login-container">
        <Registration isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

export default RegistrationPage;
