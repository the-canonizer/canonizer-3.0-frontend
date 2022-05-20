import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBarNoFilter from "../components/ComponentPages/Home/SideBarNoFilter";
import RecentActivities from "../components/ComponentPages/Home/RecentActivities";
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
const RecentActivitiesPage = ({ nameSpacesList, topicsData, algorithms }) => {
  const dispatch = useDispatch();
  dispatch(setCanonizedTopics(topicsData));
  dispatch(setCanonizedNameSpaces(nameSpacesList));
  dispatch(setCanonizedAlgorithms(algorithms));
  return (
    <>
      <Layout routeName={"recent-activities"}>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <Row gutter={16}>
            <Col xs={24} sm={24} xl={24}>
              <RecentActivities />
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
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
  const nameSpaces = await getCanonizedNameSpacesApi();
  const result = await getCanonizedTopicsApi(reqBody);

  const canonizedAlgorithms = await getCanonizedAlgorithmsApi();
  const topicsData = result || [];
  const nameSpacesList = nameSpaces || [];
  const algorithms = canonizedAlgorithms || [];

  return {
    props: {
      topicsData,
      nameSpacesList,

      algorithms,
    },
  };
}

RecentActivitiesPage.displayName = "BrowsePage";

export default RecentActivitiesPage;
