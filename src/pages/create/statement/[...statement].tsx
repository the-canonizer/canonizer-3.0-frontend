import AddOrManage from "../../../components/ComponentPages/Statement/AddOrManage";
import Layout from "../../../hoc/layout";

const CreateNewStatement = () => {
  return (
    <>
      <Layout>
        <div className="pageContentWrap">
          <AddOrManage add={true} />
        </div>
      </Layout>
    </>
  );
};
CreateNewStatement.displayName = "CreateNewStatement";

export default CreateNewStatement;
