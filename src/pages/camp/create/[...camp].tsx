import CreateNewCamp from "src/components/ComponentPages/CreateNewCamp";

import Layout from "src/hoc/layout";

const CreateNewCampPage = () => {
  return (
    <Layout routeName={"create-camp"}>
      <CreateNewCamp />
    </Layout>
  );
};

CreateNewCampPage.displayName = "CreateNewCampPage";

export default CreateNewCampPage;
