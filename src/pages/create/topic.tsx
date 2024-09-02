import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getCanonizedAlgorithmsApi,
  getCanonizedNameSpacesApi,
} from "src/network/api/homePageApi";
import CreateNewTopic from "src/components/ComponentPages/CreateNewTopic";
import Layout from "src/hoc/layout";
import {
  setCanonizedAlgorithms,
  setCanonizedNameSpaces,
} from "src/store/slices/homePageSlice";
import { createToken } from "src/network/api/userApi";
import { setTags } from "src/store/slices/tagsSlice";
import { getAllTags } from "src/network/api/tagsApi";

const CreateTopicPage = ({ nameSpacesList, algorithms, cats }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCanonizedNameSpaces(nameSpacesList));
    dispatch(setCanonizedAlgorithms(algorithms));
    dispatch(setTags(cats));
  }, []);

  return (
    <Layout routeName={"/create/topic"}>
      <CreateNewTopic />
    </Layout>
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
  const categories = await getAllTags(null, null, "", "asc", token);

  return {
    props: {
      nameSpacesList: nameSpaces || [],
      algorithms: canonizedAlgorithms || [],
      cats: categories?.data?.items || [],
    },
  };
}

CreateTopicPage.displayName = "CreateNewTopicPage";

export default CreateTopicPage;
