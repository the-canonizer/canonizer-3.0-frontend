import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SettingsUI from "../components/ComponentPages/SettingsUI";
import Layout from "../hoc/layout";
//Route : /settings
export default function Settings() {
  const isAuthenticate = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  return (
    <>
      {isAuthenticate ? (
        <Layout>
          <SettingsUI />
        </Layout>
      ) : (
        <GetStartedLayout routeName={"login"}>
          <Card bordered={false} className="login-container">
            <Login isModal={false} />
          </Card>
        </GetStartedLayout>
      )}
    </>
  );
}
