import { Row, Col } from "antd";

import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "components/ComponentPages/Home/FeaturedTopic/seeMoreLink";

function CampRecentActivitiesHeader({
  isActivityTab,
  router,
  userData,
  hasShowViewAll,
}) {
  return (
    <Row gutter={15}>
      <Col md={12} sm={12} xs={12}>
        <SectionHeading title="Updates" infoContent="" icon={null} />
      </Col>
      {userData?.is_admin && hasShowViewAll && isActivityTab && (
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk
            title="View All"
            href={{
              pathname: "/activities",
              query: {
                topic_num: router?.query?.camp[0]?.split("-")[0],
                camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
              },
            }}
          />
        </Col>
      )}
    </Row>
  );
}

export default CampRecentActivitiesHeader;
