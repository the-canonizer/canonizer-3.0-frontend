import AddOrManage from "../../../components/ComponentPages/Statement/AddOrManage";
import Layout from "../../../hoc/layout";

export default function AddStatement() {
  return (
    <>
      <Layout>
        <div className="pageContentWrap">
          <AddOrManage add={true} />
        </div>
      </Layout>
    </>
  );
}
