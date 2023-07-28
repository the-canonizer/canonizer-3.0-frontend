import { Row, Col } from "antd";
import dynamic from "next/dynamic";
import useAuthentication from "../../../hooks/isUserAuthenticated";
// import SideBar from "./SideBar";
const SideBar = dynamic(() => import("./SideBar"));
// import TopicsList from "./TopicsList";
const TopicsList = dynamic(() => import("./TopicsList"));
// import HelpCard from "./HelpCard";
// import RecentActivities from "./RecentActivities";
const RecentActivities = dynamic(() => import("./RecentActivities"));
const HelpCard = dynamic(() => import("./HelpCard"));

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <aside
        className="leftSideBar miniSideBar"
        data-testid="sideBar"
      >
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <Row gutter={8}>
          <Col xs={24} sm={24} xl={12} data-testid="topicsList">
            <TopicsList />
          </Col>
          {isUserAuthenticated && (
            <Col xs={24} sm={24} xl={12} data-testid="recentActivities">
              <RecentActivities />
            </Col>
          )}
          <Col
            xs={24}
            sm={24}
            xl={isUserAuthenticated ? 24 : 12}
            className={isUserAuthenticated && "logged-in-view"}
            data-testid="helpCard"
          >
            <HelpCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePageContainer;
