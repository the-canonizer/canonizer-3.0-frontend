import { Row, Col } from "antd";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import SideBar from "./SideBar";
const TopicsList = dynamic(() => import("./TopicsList"), { ssr: false });
import HelpCard from "./HelpCard";
import dynamic from "next/dynamic";
const RecentActivities = dynamic(() => import("./RecentActivities"), {
  ssr: false,
});

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <Row gutter={8}>
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
