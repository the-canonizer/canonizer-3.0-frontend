import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import HomePageContainer from "src/components/ComponentPages/Home";
import {
  getCanonizedNameSpacesApi,
  getCanonizedWhatsNewContentApi,
  getCanonizedAlgorithmsApi,
  getCanonizedTopicsApi,
} from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { GetUserProfileInfo } from "src/network/api/userApi";
import { setAuthToken, setLoggedInUser } from "src/store/slices/authSlice";
import {
  setCanonizedAlgorithms,
  setCanonizedNameSpaces,
  setWhatsNewContent,
  setCanonizedTopics,
} from "src/store/slices/homePageSlice";

function Home({
  current_date,
  nameSpacesList,
  whatsNew,
  algorithms,
  topicsData,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));

  // useEffect(() => {
  //   getCanonizedWhatsNewContentApi();
  // }, []);
  dispatch(setCanonizedTopics(topicsData));
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setWhatsNewContent(whatsNew));
  dispatch(setCanonizedAlgorithms(algorithms));

  useEffect(() => {
    let queries = router.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      rest.canon = namespace;
      router.query = rest;
      delete router?.query?.namespace;
      router.replace(router, null, { shallow: true });
    }
  }, []);

  useEffect(() => {
    let queries = router.query,
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
        const { access_token, ...rest } = router?.query;
        router.query = rest;
        await router.replace(router, null, { shallow: true });
      }
    };

    if (accessToken) {
      localStorage.setItem("auth_token", accessToken);
      dispatch(setAuthToken(accessToken));
      getData(accessToken);
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
  const currentTime = Date.now() / 1000;
  const reqBody = {
    algorithm: "blind_popularity",
    asofdate: currentTime,
    filter: 0,
    namespace_id: 1,
    page_number: 1,
    page_size: 15,
    search: "",
    asof: "default",
  };
  const [nameSpaces, whatsNewResult, canonizedAlgorithms, result] =
    await Promise.all([
      getCanonizedNameSpacesApi(),
      getCanonizedWhatsNewContentApi(),
      getCanonizedAlgorithmsApi(),
      getCanonizedTopicsApi(reqBody),
    ]);
  return {
    props: {
      current_date: currentDate,
      nameSpacesList: nameSpaces || [],
      whatsNew: whatsNewResult || [],
      algorithms: canonizedAlgorithms || [],
      topicsData: result || [],
    },
  };
}

Home.displayName = "Home";

export default Home;
