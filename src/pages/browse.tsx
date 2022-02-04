import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBar from "../components/componentPages/home/sideBar";
import TopicsList from "../components/componentPages/home/topicsList";
import { getCanonizedNameSpacesApi } from "../network/api/homePageApi";
import { setCanonizedNameSpaces } from "../store/slices/homePageSlice";
import { useDispatch } from "react-redux";
const BrowsePage = ({ nameSpacesList }) => {
  const dispatch = useDispatch();
  dispatch(setCanonizedNameSpaces(nameSpacesList));
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

  const nameSpacesList = nameSpaces || [];

  return {
    props: {
      nameSpacesList,
    },
  };
}

export default BrowsePage;
