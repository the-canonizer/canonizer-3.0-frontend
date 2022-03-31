import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import SettingsUI from "../components/ComponentPages/SettingsUI";
import Layout from "../hoc/layout";
import useAuthentication from "../hooks/isUserAuthenticated";
//Route : /settings
function Settings() {
  const SettingsLayout = () => {
    const isUserAuthenticated = useAuthentication();
    if (isUserAuthenticated) {
      return (
        <Layout>
          <SettingsUI />
        </Layout>
      );
    }
    return (
      <GetStartedLayout initialProps={undefined} initialState={undefined}>
        <Card bordered={false} className="login-container">
          <Login isModal={false} />
        </Card>
      </GetStartedLayout>
    );
  };
  return <SettingsLayout />;
}

Settings.displayName = "Settings";

export default Settings;
