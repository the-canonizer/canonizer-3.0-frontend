import { Card } from "antd";
import Login from "../components/ComponentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import Layout from "../hoc/layout";
import useAuthentication from "../hooks/isUserAuthenticated";
import UploadFiles from "../components/ComponentPages/uploadFiles";
//Route : /settings
function UploadFile() {
  return (
    <Layout>
      <UploadFiles />
    </Layout>
  );
}
UploadFile.displayName = "UploadFile";

export default UploadFile;
