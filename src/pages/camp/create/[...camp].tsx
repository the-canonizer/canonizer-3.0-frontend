import { useDispatch } from "react-redux";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { setCanonizedAlgorithms } from "src/store/slices/homePageSlice";
import CreateNewCamp from "../../../components/ComponentPages/CreateNewCamp";

import Layout from "../../../hoc/layout";
import { createToken } from "src/network/api/userApi";

const CreateNewCampPage = ({ algorithms }: any) => {
  const dispatch = useDispatch();

  dispatch(setCanonizedAlgorithms(algorithms));
  return (
    <>
      <Layout routeName={"create-camp"}>
        <CreateNewCamp />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ req }) {
  let token = null;
  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const canonizedAlgorithms = await getCanonizedAlgorithmsApi();

  return {
    props: {
      algorithms: canonizedAlgorithms || [],
    },
  };
}

CreateNewCampPage.displayName = "CreateNewCampPage";

export default CreateNewCampPage;
