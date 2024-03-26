import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import CreateNewCamp from "src/components/ComponentPages/CreateNewCamp";

import Layout from "src/hoc/layout";

const CreateNewCampPage = () => {
  return (
    <Layout routeName={"create-camp"}>
      <CreateNewCamp />
    </Layout>
  );
};

export async function getServerSideProps() {
  const canonizedAlgorithms = await getCanonizedAlgorithmsApi();

  return {
    props: {
      algorithms: canonizedAlgorithms || [],
    },
  };
}

CreateNewCampPage.displayName = "CreateNewCampPage";

export default CreateNewCampPage;
