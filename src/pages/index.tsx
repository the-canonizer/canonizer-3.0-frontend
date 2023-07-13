import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
// import Layout from "src/hoc/layout";
const Layout = dynamic(()=> import('../hoc/layout'))
import HomePageContainer from "src/components/ComponentPages/Home";
import { getCanonizedWhatsNewContentApi } from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setCurrentDate,
} from "src/store/slices/filtersSlice";
import { GetUserProfileInfo } from "src/network/api/userApi";
import { setAuthToken, setLoggedInUser } from "src/store/slices/authSlice";
import { useCookies } from "react-cookie";

function Home({ current_date }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [cookie, setCookie] = useCookies(["authToken"]);

  dispatch(setFilterCanonizedTopics({ search: "" }));
  dispatch(setCurrentDate(current_date));

  useEffect(() => {
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
