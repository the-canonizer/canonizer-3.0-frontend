import { useEffect } from "react";
import { useRouter } from "next/router";

import ForgotPassword from "../../components/ComponentPages/ForgotPassword";
import useAuthentication from "../../hooks/isUserAuthenticated";
import CustomLayout from "src/hoc/layout";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push({ pathname: "/" });
  }, []);

  return (
    <CustomLayout className="bg-canGrey1">
      <ForgotPassword />
    </CustomLayout>
  );
};

ForgotPasswordPage.displayName = "ForgotPasswordPage";

export default ForgotPasswordPage;
