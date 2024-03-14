import { useDispatch } from "react-redux";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { setCanonizedAlgorithms } from "src/store/slices/homePageSlice";
import CreateNewCamp from "src/components/ComponentPages/CreateNewCamp";

import Layout from "src/hoc/layout";

const CreateNewCampPage = ({ algorithms }: any) => {
  const dispatch = useDispatch();

  dispatch(setCanonizedAlgorithms(algorithms));
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
