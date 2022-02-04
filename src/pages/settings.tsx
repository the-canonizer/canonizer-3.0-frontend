import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SettingsUI from "../components/ComponentPages/SettingsUI";

//Route : /settings
export default function Settings() {
  const isAuthenticate = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  return (
    <>
      {isAuthenticate ? (
        <SettingsUI></SettingsUI>
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
