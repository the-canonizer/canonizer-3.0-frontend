import { Fragment } from "react";
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
    <Fragment>
      <Layout
        afterHeader={<WelcomeContent />}
        rightSidebar={
          <div className="md:mt-3.5" data-testid="sideBar">
            {/* {!isMobile ? (
              <div className="mb-14" data-testid="topicsList">
                <TrandingTopics />
              </div>
            ) : null} */}

            <div className="mb-14" data-testid="helpCard">
              <WhatsNew />
            </div>

            {isUserAuthenticated ? (
              <div
                className="mb-14 [&_.ant-tabs-tab-btn]:!border-none"
                data-testid="recentActivities"
              >
                <RecentActivities />
              </div>
            ) : null}
          </div>
        }
      >
        <Row className="pt-4 w-100" data-testid="featuredTopic">
          <Col md={24} className="mb-14">
            <FeaturedTopic />
          </Col>
          {/* {isMobile ? (
            <Col md={24} xs={24} className="mb-14">
              <TrandingTopics />
            </Col>
          ) : null} */}
          {isUserAuthenticated && preferedTopic?.length ? (
            <Col md={24} className="mb-14" data-testid="preferedTopic">
              <PreferedTopics />
            </Col>
          ) : null}
          {/* <Col md={24} className="mb-14" data-testid="categoriesList">
            <CategoriesList />
          </Col> */}
          <Col md={24} className="mb-0" data-testid="hotTopics">
            <HotTopics />
          </Col>
        </Row>
      </Layout>
      {/* <Tour open={open} onClose={() => setOpen(false)} steps={steps} /> */}
    </Fragment>
  );
};

export default HomePageContainer;
