import AddOrManage from "../../../components/ComponentPages/Statement/AddOrManage";
import Layout from "../../../hoc/layout";

const ManageCampPage = () => {
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
ManageCampPage.displayName = "ManageCampPage";

export default ManageCampPage;
