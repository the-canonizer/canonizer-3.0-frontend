import Layout from "../hoc/layout";
import HomePageContainer from "../components/ComponentPages/Home";
import {
  getCanonizedTopicsApi,
  getCanonizedNameSpacesApi,
  getCanonizedWhatsNewContentApi,
  getCanonizedAlgorithmsApi,
} from "../network/api/homePageApi";
import { useDispatch } from "react-redux";
import {
  setCanonizedTopics,
  setCanonizedNameSpaces,
  setWhatsNewContent,
  setCanonizedAlgorithms,
} from "../store/slices/homePageSlice";

function Home({ topicsData, nameSpacesList, whatsNew, algorithms }) {
  const dispatch = useDispatch();
  dispatch(setCanonizedTopics(topicsData));
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setWhatsNewContent(whatsNew));
  dispatch(setCanonizedAlgorithms(algorithms));

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
    filter: 0,
    namespace_id: "",
    page_number: 1,
    page_size: 15,
    search: "",
    asof: "default",
  };
  const nameSpaces = await getCanonizedNameSpacesApi();
  const result = await getCanonizedTopicsApi(reqBody);
  const whatsNewResult = await getCanonizedWhatsNewContentApi();
  const canonizedAlgorithms = await getCanonizedAlgorithmsApi();
  const topicsData = result || [];
  const nameSpacesList = nameSpaces || [];
  const algorithms = canonizedAlgorithms || [];
  const whatsNew = whatsNewResult || [];

  return {
    props: {
      topicsData,
      nameSpacesList,
      whatsNew,
      algorithms,
    },
  };
}

Home.displayName = "Home";

export default Home;
