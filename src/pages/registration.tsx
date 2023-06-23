import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import Registration from "../components/ComponentPages/Registration";
import GetStartedLayout from "../hoc/getStartedLayout";
import useAuthentication from "../hooks/isUserAuthenticated";

const RegistrationPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();
  useEffect(() => {
    isUserAuthenticated && router?.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GetStartedLayout initialProps={undefined} initialState={undefined}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        <Card bordered={false} className="login-container">
          <Registration isModal={false} />
        </Card>
      </GoogleReCaptchaProvider>
    </GetStartedLayout>
  );
};

RegistrationPage.displayName = "RegistrationPage";

export default RegistrationPage;
