import Layout from "../hoc/layout";
import HomePageContainer from "../components/componentPages/home";
import { getCanonizedTopicsApi } from "../network/api/homePageApi";
import { useDispatch } from "react-redux";
import { setCanonizedTopics } from "../store/slices/homePageSlice";
import { useEffect } from "react";

export default function Home({ topicsData }) {
  const dispatch = useDispatch();

  dispatch(setCanonizedTopics(topicsData));

  return (
    <>
      <Layout>
        <HomePageContainer />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const reqBody = {
    page_number: 1,
    page_size: 15,
    namespace_id: 1,
    asofdate: 1642464000,
    algorithm: "blind_popularity",
    search: "Hard",
  };
  const result = await getCanonizedTopicsApi();
  const topicsData = result || [];

  return {
    props: {
      topicsData,
    },
  };
}
