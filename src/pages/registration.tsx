import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import Registration from "../components/ComponentPages/Registration";
import Layout from "../hoc/layout";
import useAuthentication from "../hooks/isUserAuthenticated";

const RegistrationPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout initialProps={undefined} initialState={undefined}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar"></aside>
        <div className="pageContentWrap">
          <Card
            bordered={false}
            className={`login-container ${
              router?.asPath?.includes("/login") ||
              router?.asPath?.includes("/registration")
                ? "fill-width"
                : ""
            }`}
          >
            <Registration isModal={false} />
          </Card>
        </div>
      </GoogleReCaptchaProvider>
    </Layout>
  );
};

RegistrationPage.displayName = "RegistrationPage";

export default RegistrationPage;
