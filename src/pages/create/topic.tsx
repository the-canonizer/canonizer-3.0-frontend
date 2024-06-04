import { useDispatch } from "react-redux";
import {
  getCanonizedAlgorithmsApi,
  getCanonizedNameSpacesApi,
} from "../../network/api/homePageApi";
import CreateNewTopic from "../../components/ComponentPages/CreateNewTopic";
import Layout from "../../hoc/layout";
import {
  setCanonizedAlgorithms,
  setCanonizedNameSpaces,
} from "../../store/slices/homePageSlice";
import { createToken } from "src/network/api/userApi";

const CreateNewTopicPage = ({ nameSpacesList, algorithms }: any) => {
  const dispatch = useDispatch();
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setCanonizedAlgorithms(algorithms));
  return (
    <>
      <Layout routeName={"/create/topic"}>
        <CreateNewTopic />
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

  const nameSpaces = await getCanonizedNameSpacesApi(token);
  const canonizedAlgorithms = await getCanonizedAlgorithmsApi(token);

  return {
    props: {
      nameSpacesList: nameSpaces || [],
      algorithms: canonizedAlgorithms || [],
    },
  };
}

CreateNewTopicPage.displayName = "CreateNewTopicPage";

export default CreateNewTopicPage;
