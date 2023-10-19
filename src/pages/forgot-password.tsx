import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";

import ForgotPassword from "../components/ComponentPages/ForgotPassword";
import GetStartedLayout from "../hoc/getStartedLayout";
import useAuthentication from "../hooks/isUserAuthenticated";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GetStartedLayout initialProps={undefined} initialState={undefined}>
      <Card bordered={false} className="login-container">
        <ForgotPassword isModal={false} />
      </Card>
    </GetStartedLayout>
  );
};

ForgotPasswordPage.displayName = "ForgotPasswordPage";

export default ForgotPasswordPage;
