import { Row, Col } from "antd";

import Layout from "../hoc/layout";
import SideBarNoFilter from "../components/ComponentPages/Home-old/SideBarNoFilter";
import RecentActivities from "../components/ComponentPages/Home/RecentActivities";

const RecentActivitiesPage = () => {
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

RecentActivitiesPage.displayName = "RecentActivitiesPage";

export default RecentActivitiesPage;
