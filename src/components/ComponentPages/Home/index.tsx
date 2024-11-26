import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import useAuthentication from "src/hooks/isUserAuthenticated";

import Layout from "src/hoc/layout";
import WelcomeContent from "./WelcomeArea";
import FeaturedTopic from "./FeaturedTopic";
// import CategoriesList from "./CategoriesList";
import HotTopics from "./HotTopics";
// import TrandingTopics from "./TrandingTopic";
import WhatsNew from "./WhatsNew";
import PreferedTopics from "./PreferedTopic";
import RecentActivities from "./RecentActivities";
// import { useIsMobile } from "src/hooks/useIsMobile";
import { RootState } from "src/store";

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();
  // const isMobile = useIsMobile();

  const { preferedTopic } = useSelector((state: RootState) => ({
    preferedTopic: state?.hotTopic?.preferedTopic,
  }));

  return (
    <Layout
      afterHeader={<WelcomeContent />}
      rightSidebar={
        <div className="md:mt-3.5" data-testid="sideBar" id="home-sidebar">
          {/* {!isMobile ? (
          <div className="mb-14" data-testid="topicsList" id="trending-topics">
          <TrandingTopics />
          </div>
        ) : null} */}

          <div className="mb-14" data-testid="helpCard" id="whatsnew-content">
            <WhatsNew />
          </div>

          {isUserAuthenticated ? (
            <div
              className="mb-14 [&_.ant-tabs-tab-btn]:!border-none"
              data-testid="recentActivities"
              id="recent-activities"
            >
              <RecentActivities />
            </div>
          ) : null}
        </div>
      }
    >
      <Row
        className="pt-4 w-100"
        data-testid="featuredTopic"
        id="featured-topic"
      >
        <Col md={24} className="mb-14" id="featured-topic-col">
          <FeaturedTopic />
        </Col>
        {/* {isMobile ? (
        <Col md={24} xs={24} className="mb-14" id="trending-topics-col">
          <TrandingTopics />
        </Col>
        ) : null} */}
        {isUserAuthenticated && preferedTopic?.length ? (
          <Col
            md={24}
            className="mb-14"
            data-testid="preferedTopic"
            id="prefered-topic"
          >
            <PreferedTopics />
          </Col>
        ) : null}
        {/* <Col md={24} className="mb-14" data-testid="categoriesList" id="categories-list">
        <CategoriesList />
        </Col> */}
        <Col md={24} className="mb-0" data-testid="hotTopics" id="hot-topics">
          <HotTopics />
        </Col>
      </Row>
    </Layout>
  );
};

export default HomePageContainer;
