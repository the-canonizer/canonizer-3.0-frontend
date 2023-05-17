import { Row, Col } from "antd";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import SideBar from "./SideBar";
import TopicsList from "./TopicsList";
import HelpCard from "./HelpCard";
import RecentActivities from "./RecentActivities";
import { useState } from "react";

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();
  
  const [backGroundColorClass, setBackGroundColorClass] = useState("default");

  return (
    <>
      <aside className="leftSideBar miniSideBar">
        <SideBar backGroundColorClass={backGroundColorClass}/>
      </aside>
      <div className="pageContentWrap">
        <Row gutter={8}>
          <Col xs={24} sm={24} xl={12}>
            <TopicsList backGroundColorClass={backGroundColorClass} setBackGroundColorClass={setBackGroundColorClass}/>
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
