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

const HomePageContainer = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Layout
      afterHeader={<WelcomeContent />}
      rightSidebar={
        <div className="pt-4">
          <div className="mb-6">
            <TrandingTopics />
          </div>

          {isUserAuthenticated ? (
            <div className="mb-4">
              <RecentActivities isUserAuthenticated={isUserAuthenticated} />
            </div>
          ) : (
            <div className="mb-4">
              <WhatsNew />
            </div>
          )}
        </div>
      }
    >
      <Row className="pt-4 w-100">
        <Col md={24} className="mb-6">
          <FeaturedTopic />
        </Col>
        {isUserAuthenticated ? (
          <Col md={24} className="mb-6">
            <PreferedTopics />
          </Col>
        ) : null}
        <Col md={24} className="mb-6">
          <CategoriesList />
        </Col>
        <Col md={24} className="mb-6">
          <HotTopics />
        </Col>
        <Col md={12}></Col>
      </Row>
    </Layout>
  );
};

export default HomePageContainer;
