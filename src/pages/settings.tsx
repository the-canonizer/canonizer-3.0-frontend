import SettingsUI from "../components/ComponentPages/SettingsUI";
import Layout from "../hoc/layout";
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
