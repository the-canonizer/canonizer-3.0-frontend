import AddOrManage from "src/components/ComponentPages/Statement/AddOrManage";
import Layout from "src/hoc/layout";

const ManageTopicPage = () => {
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

ManageTopicPage.displayName = "ManageTopicPage";
export default ManageTopicPage;
