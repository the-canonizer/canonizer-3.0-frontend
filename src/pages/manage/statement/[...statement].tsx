import Layout from "src/hoc/layout";
import UpdateStatement from "components/ComponentPages/ManageStatement";

const ManageStatementPage = () => {
  return (
    <Layout>
      <UpdateStatement isEdit={true} />
    </Layout>
  );
};

ManageStatementPage.displayName = "ManageStatementPage";

export default ManageStatementPage;
