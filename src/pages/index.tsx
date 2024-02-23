import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import HomePageContainer from "src/components/ComponentPages/Home";
import { getCanonizedWhatsNewContentApi } from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { GetUserProfileInfo, createToken } from "src/network/api/userApi";
import { setAuthToken, setLoggedInUser } from "src/store/slices/authSlice";
import { setHotTopic } from "src/store/slices/hotTopicSlice";
import { GetHotTopicDetails } from "src/network/api/topicAPI";

function Home({ current_date, hotTopicData }: any) {
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));
  /* eslint-disable */
  useEffect(() => {
    dispatch(setHotTopic(hotTopicData));
    getCanonizedWhatsNewContentApi();
  }, []);
  /* eslint-enable */

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
    <Layout>
      <HomePageContainer />
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const currentDate = new Date().valueOf();
  let token = null;
  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const resData = await GetHotTopicDetails(token as string);
  console.log("🚀 ~ getServerSideProps ~ resData:", resData);

  return {
    props: {
      current_date: currentDate,
      hotTopicData: resData?.data ? resData?.data : null,
    },
  };
}

Home.displayName = "Home";

export default Home;
