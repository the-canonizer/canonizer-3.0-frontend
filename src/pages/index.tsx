import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

import Layout from "../hoc/layout";
const HomePageContainer = dynamic(
  () => import("../components/ComponentPages/Home"),
  { ssr: false }
);
import { getCanonizedWhatsNewContentApi } from "../network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";

function Home({ current_date }) {
  const dispatch = useDispatch();

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
    <Fragment>
      <Layout>
        <HomePageContainer />
      </Layout>
    </Fragment>
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
