import { useEffect } from "react";
import { useRouter } from "next/router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";

import RegistrationOTP from "src/components/ComponentPages/Registration/OTP";
import Layout from "src/hoc/layout";
import { setEmailForOTP } from "src/store/slices/authSlice";
import { RootState } from "src/store";

const RegistrationPage = () => {
  const { emailForOtp } = useSelector((state: RootState) => ({
    emailForOtp: state?.auth?.emailForOtp,
  }));

  const dispatch = useDispatch(),
    router = useRouter();

  useEffect(() => {
    if (!emailForOtp) {
      router?.push({ pathname: "/registration" });
    }

    return () => dispatch(setEmailForOTP(null));
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
        <RegistrationOTP />
      </GoogleReCaptchaProvider>
    </Layout>
  );
};

RegistrationPage.displayName = "RegistrationPage";

export default RegistrationPage;
