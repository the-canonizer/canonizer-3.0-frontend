import UpdateCamps from "components/ComponentPages/CreateNewCamp/updateCamp";
import Layout from "src/hoc/layout";

const ManageCampPage = () => {
  return (
    <Layout>
      <UpdateCamps />
    </Layout>
  );
};

ManageCampPage.displayName = "ManageCampPage";

export default ManageCampPage;
