import Layout from "../hoc/layout";
import UploadFiles from "../components/ComponentPages/UploadFiles";

function UploadFile() {
  return (
    <Layout>
      <UploadFiles />
    </Layout>
  );
}

UploadFile.displayName = "UploadFile";

export default UploadFile;
