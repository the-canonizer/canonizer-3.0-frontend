import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "antd";

import Layout from "../hoc/layout";
import Login from "../components/ComponentPages/Login";
import useAuthentication from "../hooks/isUserAuthenticated";

const LoginPage = () => {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    isUserAuthenticated && router?.push("/");
  }, [isUserAuthenticated]);

  return (
    <Layout initialProps={undefined} initialState={undefined}>
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
          <Login isModal={false} />
        </Card>
      </div>
    </Layout>
  );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;
