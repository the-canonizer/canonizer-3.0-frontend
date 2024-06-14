import { Row, Col } from "antd";

import useAuthentication from "../../../hooks/isUserAuthenticated";

import Layout from "src/hoc/layout";
import WelcomeContent from "./WelcomeArea";
import FeaturedTopic from "./FeaturedTopic";
import CategoriesList from "./CategoriesList";
import HotTopics from "./HotTopics";
import TrandingTopics from "./TrandingTopic";
import WhatsNew from "./WhatsNew";
import PreferedTopics from "./PreferedTopic";
import RecentActivities from "./RecentActivities";
import { useIsMobile } from "src/hooks/useIsMobile";

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();
  const isMobile = useIsMobile();

  return (
    <Layout
      afterHeader={<WelcomeContent />}
      rightSidebar={
        <div className="pt-4 sm:pt-0" data-testid="sideBar">
          {!isMobile ? (
            <div className="mb-6" data-testid="topicsList">
              <TrandingTopics />
            </div>
          ) : null}

          {isUserAuthenticated ? (
            <div className="mb-4" data-testid="recentActivities">
              <RecentActivities isUserAuthenticated={isUserAuthenticated} />
            </div>
          ) : null}

          <div className="mb-4" data-testid="helpCard">
            <WhatsNew />
          </div>
        </div>
      }
    >
      <Row className="pt-4 w-100" data-testid="featuredTopic">
        <Col md={24} className="mb-6">
          <FeaturedTopic />
        </Col>
        {isMobile ? (
          <Col md={24} xs={24} className="mb-6">
            <TrandingTopics />
          </Col>
        ) : null}
        {isUserAuthenticated ? (
          <Col md={24} className="mb-6" data-testid="preferedTopic">
            <PreferedTopics />
          </Col>
        ) : null}
        <Col md={24} className="mb-6" data-testid="categoriesList">
          <CategoriesList />
        </Col>
        <Col md={24} className="mb-6 sm:mb-2" data-testid="hotTopics">
          <HotTopics />
        </Col>
        <Col md={12}></Col>
      </Row>
    </Layout>
  );
};

export default HomePageContainer;
