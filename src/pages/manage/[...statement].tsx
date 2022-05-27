import Add from "../../components/ComponentPages/News/AddOrEdit";
import AddOrManage from "../../components/ComponentPages/Statement/AddOrManage";
import Layout from "../../hoc/layout";

export default function ManageStatement() {
  return (
    <>
      <Layout>
        <div className="pageContentWrap">
          <AddOrManage add={false} />
        </div>
      </Layout>
    </>
  );
}
