import { useDispatch } from "react-redux";

import { getCanonizedNameSpacesApi } from "../../network/api/homePageApi";
import CreateNewTopic from "../../components/ComponentPages/CreateNewTopic";

import Layout from "../../hoc/layout";
import { setCanonizedNameSpaces } from "../../store/slices/homePageSlice";

const CreateNewTopicPage = ({ nameSpacesList }) => {
  const dispatch = useDispatch();

  dispatch(setCanonizedNameSpaces(nameSpacesList));

  return (
    <>
      <Layout routeName={"/create/topic"}>
        <CreateNewTopic />
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const nameSpaces = await getCanonizedNameSpacesApi();

  return {
    props: {
      nameSpacesList: nameSpaces || [],
    },
  };
}

CreateNewTopicPage.displayName = "CreateNewTopicPage";

export default CreateNewTopicPage;
