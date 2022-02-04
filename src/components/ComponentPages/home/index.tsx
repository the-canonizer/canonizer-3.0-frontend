import { Row, Col } from "antd";

import useAuthentication from "../../../hooks/isUserAuthenticated";
import SideBar from "./sideBar";
import TopicsList from "./topicsList";
import HelpCard from "./helpCard";
import RecentActivities from "./recentActivities";

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <Row gutter={16}>
          <Col xs={24} sm={24} xl={12}>
            <TopicsList />
          </Col>
          {isUserAuthenticated && (
            <Col xs={24} sm={24} xl={12}>
              <RecentActivities />
            </Col>
          )}
          <Col
            xs={24}
            sm={24}
            xl={isUserAuthenticated ? 24 : 12}
            className={isUserAuthenticated && "logged-in-view"}
          >
            <HelpCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePageContainer;
