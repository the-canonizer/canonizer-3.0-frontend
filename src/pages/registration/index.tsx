import { useEffect } from "react";
import { useRouter } from "next/router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import Registration from "src/components/ComponentPages/Registration";
import Layout from "src/hoc/layout";
import useAuthentication from "src/hooks/isUserAuthenticated";

const RegistrationPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push("/");
    // eslint-disable-next-line
  }, []);

  return (
    <Layout withOutHeader={true} className="bg-canGrey1 min-h-screen">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        <Registration />
      </GoogleReCaptchaProvider>
    </Layout>
  );
};

RegistrationPage.displayName = "RegistrationPage";

export default RegistrationPage;
