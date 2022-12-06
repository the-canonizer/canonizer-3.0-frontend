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
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { useEffect } from "react";

function Home({ current_date }) {
  const dispatch = useDispatch();

  // dispatch(setCanonizedNameSpaces(nameSpacesList));
  // dispatch(setWhatsNewContent(whatsNew));
  // dispatch(setCanonizedAlgorithms(algorithms));
  
  dispatch(
    setFilterCanonizedTopics({
      search: "",
    })
  );

  dispatch(setCurrentDate(current_date));

  useEffect(() => {
    getCanonizedWhatsNewContentApi();
  }, []);

  return (
    <>
      <Layout>
        <HomePageContainer />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const currentDate = new Date().valueOf();

  return {
    props: {
      current_date: currentDate,
    },
  };
}

Home.displayName = "Home";

export default Home;
