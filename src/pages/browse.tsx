import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBar from "../components/ComponentPages/home/sideBar";
import TopicsList from "../components/componentPages/home/topicsList";

const BrowsePage = () => {
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

export default BrowsePage;
