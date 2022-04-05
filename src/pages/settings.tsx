import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import SettingsUI from "../components/ComponentPages/SettingsUI";
import Layout from "../hoc/layout";
import useAuthentication from "../hooks/isUserAuthenticated";
//Route : /settings
function Settings() {
  return (
    <Layout>
      <SettingsUI />
    </Layout>
  );
}

Settings.displayName = "Settings";

export default Settings;
