import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import Layout from "../hoc/layout";
import useAuthentication from "../hooks/isUserAuthenticated";
import UploadFiles from "../components/ComponentPages/uploadFiles";
//Route : /settings
export default function UploadFile() {
  const UploadFileLayout = () => {
    const isUserAuthenticated = useAuthentication();
    if (isUserAuthenticated) {
      return (
        <Layout>
          <UploadFiles />
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
  return <UploadFileLayout />;
}
