import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import ForgotPasswordOTP from "components/ComponentPages/ForgotPassword/otp";
import useAuthentication from "src/hooks/isUserAuthenticated";
import CustomLayout from "src/hoc/layout";
import { RootState } from "src/store";
import { setPasswordEmail } from "src/store/slices/authSlice";

const ForgotPasswordPage = () => {
  const { passwordEmail } = useSelector((state: RootState) => ({
    passwordEmail: state?.auth?.passwordEmail,
  }));

  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    if (isUserAuthenticated) {
      router?.push({ pathname: "/" });
    }

    if (!passwordEmail) {
      // router?.push({ pathname: "/forgot-password" });
    }
  }, [passwordEmail]);

  useEffect(() => {
    return () => {
      dispatch(setPasswordEmail(null));
    };
  }, []);

  return (
    <CustomLayout className="bg-canGrey1" withOutHeader={true}>
      <ForgotPasswordOTP />
    </CustomLayout>
  );
};

ForgotPasswordPage.displayName = "ForgotPasswordPage";

export default ForgotPasswordPage;
