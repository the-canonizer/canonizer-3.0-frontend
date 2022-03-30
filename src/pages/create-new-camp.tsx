import CreateNewCamp from "../components/ComponentPages/CreateNewCamp";

import Layout from "../hoc/layout";

const CreateNewCampPage = () => {
  return (
    <>
      <Layout routeName={"create-new-camp"}>
        <CreateNewCamp />
      </Layout>
    </>
  );
};

CreateNewCampPage.displayName = "CreateNewCampPage";

export default CreateNewCampPage;
