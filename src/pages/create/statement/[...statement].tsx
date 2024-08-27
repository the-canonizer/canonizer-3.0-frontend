import Layout from "src/hoc/layout";
import CreateStatement from "components/ComponentPages/ManageStatement";

const ManageStatementPage = () => {
  return (
    <Layout>
      <CreateStatement />
    </Layout>
  );
};

ManageStatementPage.displayName = "CreateNewStatement";

export default ManageStatementPage;
