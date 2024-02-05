import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBar from "../components/ComponentPages/Home/SideBar";
import TopicsList from "../components/ComponentPages/Home/TopicsList";
import { setCurrentDate, setOnlyMyTopic } from "src/store/slices/filtersSlice";

const BrowsePage = ({ current_date }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(setCurrentDate(current_date));

  useEffect(() => {
    let queries = router?.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      rest.canon = namespace;
      router.query = rest;
      router?.replace(router, null, { shallow: true });
    }

    return () => dispatch(setOnlyMyTopic(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout routeName={"browse"}>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <Row gutter={16}>
          <Col xs={24} sm={24} xl={24}>
            <TopicsList />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const currentDate = new Date().valueOf();

  return {
    props: {
      current_date: currentDate,
    },
  };
}

BrowsePage.displayName = "BrowsePage";

export default BrowsePage;
