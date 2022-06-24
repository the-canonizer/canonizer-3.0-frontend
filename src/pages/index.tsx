import Layout from "../hoc/layout";
import HomePageContainer from "../components/ComponentPages/Home";
import {
  getCanonizedNameSpacesApi,
  getCanonizedWhatsNewContentApi,
  getCanonizedAlgorithmsApi,
} from "../network/api/homePageApi";
import { useDispatch } from "react-redux";
import {
  setCanonizedNameSpaces,
  setWhatsNewContent,
  setCanonizedAlgorithms,
} from "../store/slices/homePageSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

function Home({ nameSpacesList, whatsNew, algorithms }) {
  const dispatch = useDispatch();

  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setWhatsNewContent(whatsNew));
  dispatch(setCanonizedAlgorithms(algorithms));
  dispatch(
    setFilterCanonizedTopics({
      search: "",
    })
  );

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
