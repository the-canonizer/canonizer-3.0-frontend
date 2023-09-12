import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
// import { useCookies } from "react-cookie";
// import dynamic from "next/dynamic";

import Layout from "src/hoc/layout";
import HomePageContainer from "src/components/ComponentPages/Home";
import { getCanonizedWhatsNewContentApi } from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { GetUserProfileInfo } from "src/network/api/userApi";
import { setAuthToken, setLoggedInUser } from "src/store/slices/authSlice";
import { setHotTopic } from "src/store/slices/hotTopicSlice";
import { GetHotTopicDetails } from "src/network/api/topicAPI";

function Home({ current_date, hotTopicData }) {
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));

  useEffect(() => {
    dispatch(setHotTopic(hotTopicData));
    getCanonizedWhatsNewContentApi();
  }, []);

  useEffect(() => {
    let queries = router?.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      rest.canon = namespace;
      router.query = rest;
      delete router?.query?.namespace;
      router?.replace(router, null, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let queries = router?.query,
      accessToken = queries?.access_token as string;

    const getData = async (token: string) => {
      let resData = await GetUserProfileInfo(token);
      if (resData.status_code === 200) {
        dispatch(
          setLoggedInUser({
            ...resData?.data,
            token: accessToken,
            refresh_token: null,
          })
        );
        document.cookie =
          "loginToken=" +
          accessToken +
          "; expires=Thu, 15 Jul 2030 00:00:00 UTC; path=/";
        // eslint-disable-next-line no-unused-vars
        const { access_token, ...rest } = router?.query;
        router.query = rest;
        await router?.replace(router, null, { shallow: true });
      }
    };

    if (accessToken) {
      localStorage.setItem("auth_token", accessToken);
      dispatch(setAuthToken(accessToken));
      getData(accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Layout>
        <HomePageContainer />
      </Layout>
    </Fragment>
  );
}

export async function getServerSideProps({ req }) {
  const currentDate = new Date().valueOf();

  const resData = await GetHotTopicDetails(req.cookies["loginToken"] as string);

  return {
    props: {
      current_date: currentDate,
      hotTopicData: resData?.data || null,
    },
  };
}

Home.displayName = "Home";

export default Home;
