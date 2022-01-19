import * as React from "react";
import SideBar from "./sideBar";
import TopicsList from "./topicsList";
import HelpCard from "./helpCard";
import { Row, Col } from "antd";

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
          <Col xs={24} sm={24} xl={12}>
            <HelpCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePageContainer;
