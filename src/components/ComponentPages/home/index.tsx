import { useEffect, useState } from "react";
import { Row, Col } from "antd";

import useAuthentication from "../../../hooks/isUserAuthenticated";
import SideBar from "./sideBar";
import TopicsList from "./topicsList";
import HelpCard from "./helpCard";
import RecentActivities from "./recentActivities";

const HomePageContainer = () => {
  
  const [isLogin, setIsLogin] = useState(false);
  const { isUserAuthenticated } = useAuthentication();
  useEffect(() => {
    if (isUserAuthenticated) {
      setIsLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {isLogin && 
            <Col xs={24} sm={24} xl={12}>
                <RecentActivities />
            </Col>
          }
          <Col xs={24} sm={24} xl={isLogin ? 24 : 12} className={isLogin && 'logged-in-view'}>
            <HelpCard />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePageContainer;
