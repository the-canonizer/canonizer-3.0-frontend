import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBar from "../components/ComponentPages/Home/SideBar";
import TopicsList from "../components/ComponentPages/Home/TopicsList";
import {
  getCanonizedAlgorithmsApi,
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
  getCanonizedWhatsNewContentApi,
} from "../network/api/homePageApi";
import {
  setCanonizedAlgorithms,
  setCanonizedNameSpaces,
  setCanonizedTopics,
} from "../store/slices/homePageSlice";
import { useDispatch } from "react-redux";
const BrowsePage = ({ nameSpacesList, topicsData, algorithms }) => {
  const dispatch = useDispatch();
  dispatch(setCanonizedTopics(topicsData));
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setCanonizedAlgorithms(algorithms));
  return (
    <>
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
    </>
  );
};

export async function getServerSideProps() {
  const nameSpaces = await getCanonizedNameSpacesApi();

  const canonizedAlgorithms = await getCanonizedAlgorithmsApi();

  const nameSpacesList = nameSpaces || [];
  const algorithms = canonizedAlgorithms || [];

  return {
    props: {
      nameSpacesList,
      algorithms,
    },
  };
}

BrowsePage.displayName = "BrowsePage";

export default BrowsePage;
