import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Layout from "src/hoc/layout";
import Resetpassword from "components/ComponentPages/ResetPassword";
import { RootState } from "src/store";
import { setIsPasswordVerfied } from "src/store/slices/authSlice";

const ResetPasswordPage = () => {
  const { isPasswordVerfied } = useSelector((state: RootState) => ({
    isPasswordVerfied: state?.auth?.isPasswordVerfied,
  }));

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isPasswordVerfied) {
      // router?.push({ pathname: "/forgot-password" });
    }
  }, [isPasswordVerfied]);

  useEffect(() => {
    return () => {
      dispatch(setIsPasswordVerfied(null));
    };
  }, []);

  return (
    <Layout
      routeName={"reset-password"}
      className="bg-canGrey1"
      withOutHeader={true}
    >
      <Resetpassword />
    </Layout>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";

export default ResetPasswordPage;
