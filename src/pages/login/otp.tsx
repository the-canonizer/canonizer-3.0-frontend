import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Layout from "src/hoc/layout";
import LoginOTP from "src/components/ComponentPages/Login/otp";
import { RootState } from "src/store";
import { setEmailForOTP } from "src/store/slices/authSlice";

const LoginPage = () => {
  const { emailForOtp } = useSelector((state: RootState) => ({
    emailForOtp: state?.auth?.emailForOtp,
  }));

  const dispatch = useDispatch(),
    router = useRouter();

  useEffect(() => {
    if (!emailForOtp) {
      router?.push({ pathname: "/login" });
    }

    return () => dispatch(setEmailForOTP(null));
    // eslint-disable-next-line
  }, []);

  return (
    <Layout withOutHeader={true} className="bg-canGrey1 min-h-screen">
      <LoginOTP />
    </Layout>
  );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;
