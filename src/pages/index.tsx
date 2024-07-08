import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import HomePageContainer from "src/components/ComponentPages/Home";
import { getCanonizedWhatsNewContentApi } from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { GetUserProfileInfo, createToken } from "src/network/api/userApi";
import { setAuthToken, setLoggedInUser } from "src/store/slices/authSlice";
import {
  setFeaturedTopic,
  setHotTopic,
  setPrefTopic,
} from "src/store/slices/hotTopicSlice";
import {
  GetFeaturedTopicDetails,
  GetHotTopicDetails,
  GetPreferedTopicDetails,
} from "src/network/api/topicAPI";

const Tour = dynamic(() => import("src/components/ComponentPages/Home/Tour"), {
  ssr: false,
});

function Home({ current_date, hotTopicData, featuredData, prefData }: any) {
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));

  /* eslint-disable */
  useEffect(() => {
    dispatch(setHotTopic(hotTopicData));
    dispatch(setFeaturedTopic(featuredData));
    dispatch(setPrefTopic(prefData));
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
    <Fragment>
      <HomePageContainer />
      <Tour />
    </Fragment>
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

  const resData = await GetHotTopicDetails(1, 6, token as string);
  const featuredData = await GetFeaturedTopicDetails(token as string);
  const prefData = await GetPreferedTopicDetails(1, 6, token as string);

  return {
    props: {
      current_date: currentDate,
      hotTopicData: resData?.data?.items ? resData?.data?.items : [],
      featuredData: featuredData?.data?.items ? featuredData?.data?.items : [],
      prefData: prefData?.data?.items ? prefData?.data?.items : null,
    },
  };
}

Home.displayName = "Home";

export default Home;
