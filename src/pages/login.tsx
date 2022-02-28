import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";

import GetStartedLayout from "../hoc/getStartedLayout";
import Login from "../components/ComponentPages/Login";
import useAuthentication from "../hooks/isUserAuthenticated";

const LoginPage = () => {
  const router = useRouter();
  const isUserAuthenticated = useAuthentication();
  useEffect(() => {
    isUserAuthenticated && router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GetStartedLayout routeName={"login"}>
      <Card bordered={false} className="login-container">
        <Login isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

export default LoginPage;
