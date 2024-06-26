import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import Login from "src/components/ComponentPages/Login";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoginPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push("/");
  }, []);

  return (
    <Layout withOutHeader={true} className="bg-canGrey1 min-h-screen">
      <Login />
    </Layout>
  );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;
