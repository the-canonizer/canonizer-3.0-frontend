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
import { createToken } from "../../network/api/userApi";

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

export async function getServerSideProps() {
  const response = await createToken();

  const nameSpaces = await getCanonizedNameSpacesApi(response?.access_token);
  const canonizedAlgorithms = await getCanonizedAlgorithmsApi(
    response?.access_token
  );

  return {
    props: {
      nameSpacesList: nameSpaces || [],
      algorithms: canonizedAlgorithms || [],
    },
  };
}

CreateNewTopicPage.displayName = "CreateNewTopicPage";

export default CreateNewTopicPage;
