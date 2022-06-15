import Layout from "../hoc/layout";
import HomePageContainer from "../components/ComponentPages/Home";
import {
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
  const [nameSpaces, whatsNewResult, canonizedAlgorithms] = await Promise.all([
    getCanonizedNameSpacesApi(),
    getCanonizedWhatsNewContentApi(),
    getCanonizedAlgorithmsApi(),
  ]);

  return {
    props: {
      nameSpacesList: nameSpaces || [],
      whatsNew: whatsNewResult || [],
      algorithms: canonizedAlgorithms || [],
    },
  };
}

Home.displayName = "Home";

export default Home;
