import Layout from "../hoc/layout";
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
