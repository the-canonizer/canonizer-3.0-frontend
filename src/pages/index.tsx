import { useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import Layout from "src/hoc/layout";
import HomePageContainer from "src/components/ComponentPages/Home";
import { getCanonizedWhatsNewContentApi } from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";

function Home({ current_date }) {
  const router = useRouter();
  const dispatch = useDispatch();

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));

  useEffect(() => {
    getCanonizedWhatsNewContentApi();
  }, []);

  useEffect(() => {
    let queries = router.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      queries = rest;
      queries.canon = namespace;
      router.query = queries;
      router.replace(router, null, { shallow: true });
    }
  }, []);

  return (
    <Fragment>
      <Layout>
        <HomePageContainer />
      </Layout>
    </Fragment>
  );
}

export async function getServerSideProps(ctx) {
  const currentDate = new Date().valueOf();

  return {
    props: { current_date: currentDate },
  };
}

Home.displayName = "Home";

export default Home;
