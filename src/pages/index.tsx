import Layout from "../hoc/layout";
import HomePageContainer from "../components/componentPages/home";
import {
  getCanonizedTopicsApi,
  getCanonizedNameSpacesApi,
  getCanonizedWhatsNewContentApi,
} from "../network/api/homePageApi";
import { useDispatch } from "react-redux";
import {
  setCanonizedTopics,
  setCanonizedNameSpaces,
  setWhatsNewContent,
} from "../store/slices/homePageSlice";

export default function Home({ topicsData, nameSpacesList, whatsNew }) {
  const dispatch = useDispatch();

  dispatch(setCanonizedTopics(topicsData));
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setWhatsNewContent(whatsNew));

  return (
    <>
      <Layout>
        <HomePageContainer />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const currentTime = Date.now() / 1000;
  const reqBody = {
    algorithm: "blind_popularity",
    asofdate: currentTime,
    filter: "2",
    namespace_id: 1,
    page_number: 1,
    page_size: 15,
    search: "Hard",
  };
  const nameSpaces = await getCanonizedNameSpacesApi();
  const result = await getCanonizedTopicsApi(reqBody);
  const whatsNewResult = await getCanonizedWhatsNewContentApi();
  const topicsData = result || [];
  const nameSpacesList = nameSpaces || [];
  const whatsNew = whatsNewResult || [];

  return {
    props: {
      topicsData,
      nameSpacesList,
      whatsNew,
    },
  };
}
