import { Fragment } from "react";
import { Row, Col } from "antd";

import useAuthentication from "src/hooks/isUserAuthenticated";

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
    <Fragment>
      <Layout
        afterHeader={<WelcomeContent />}
        rightSidebar={
          <div className="md:mt-9" data-testid="sideBar">
            {!isMobile ? (
              <div className="mb-10" data-testid="topicsList">
                <TrandingTopics />
              </div>
            ) : null}

            {isUserAuthenticated ? (
              <div className="mb-10" data-testid="recentActivities">
                <RecentActivities />
              </div>
            ) : null}

            <div className="mb-10" data-testid="helpCard">
              <WhatsNew />
            </div>
          </div>
        }
      >
        <Row className="pt-4 w-100" data-testid="featuredTopic">
          <Col md={24} className="mb-10">
            <FeaturedTopic />
          </Col>
          {isMobile ? (
            <Col md={24} xs={24} className="mb-10">
              <TrandingTopics />
            </Col>
          ) : null}
          {isUserAuthenticated ? (
            <Col md={24} className="mb-10" data-testid="preferedTopic">
              <PreferedTopics />
            </Col>
          ) : null}
          <Col md={24} className="mb-10" data-testid="categoriesList">
            <CategoriesList />
          </Col>
          <Col md={24} className="mb-10" data-testid="hotTopics">
            <HotTopics />
          </Col>
        </Row>
      </Layout>
      {/* <Tour open={open} onClose={() => setOpen(false)} steps={steps} /> */}
    </Fragment>
  );
};

export default HomePageContainer;
