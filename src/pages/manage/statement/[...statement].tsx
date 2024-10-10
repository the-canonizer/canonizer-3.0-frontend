import AddOrManage from "../../../components/ComponentPages/Statement/AddOrManage";
import Layout from "../../../hoc/layout";

const ManageStatementPage = () => {
  return (
    <>
      <Layout>
        <div className="pageContentWrap">
          <AddOrManage add={false} />
        </div>
      </Layout>
    </>
  );
};
ManageStatementPage.displayName = "ManageStatementPage";

export default ManageStatementPage;
