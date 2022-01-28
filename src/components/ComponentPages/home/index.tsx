import * as React from "react";
import { Row, Col } from "antd";

import SideBar from "./sideBar";
import TopicsList from "./topicsList";
import HelpCard from "./helpCard";
import RecentActivities from "./recentActivities";

const HomePageContainer = () => {
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
          {true && (
            <Col xs={24} sm={24} xl={12}>
              <RecentActivities />
            </Col>
          )}
          <Col xs={24} sm={24} xl={24}>
            <HelpCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePageContainer;
