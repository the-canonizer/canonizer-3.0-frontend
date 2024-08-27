import { Row, Col } from "antd";
import Image from "next/image";

import SeeMoreLInk from "../../FeaturedTopic/seeMoreLink";
import SectionHeading from "../../FeaturedTopic/sectionsHeading";

function RecentActivitiesHeader({ isActivitiesPage, onBackClick }) {
  return isActivitiesPage ? (
    <Row gutter={15}>
      <Col md={24} sm={24} xs={24}>
        <div
          className="flex items-center gap-3.5 lg:!mb-10 mt-5 "
          onClick={onBackClick}
        >
          <Image
            className="cursor-pointer"
            src="/images/recent-activiity-arrow.svg"
            width={20}
            height={20}
            alt="icon"
          />
          <SectionHeading
            title={"Recent activities"}
            infoContent=""
            icon={null}
            className={
              isActivitiesPage &&
              "lg:!text-xl !text-base !font-medium capitalize flex items-center !m-0"
            }
          />
        </div>
      </Col>
    </Row>
  ) : (
    <Row gutter={15}>
      <Col md={12} sm={12} xs={12}>
        <SectionHeading title="Recent activities" infoContent="" icon={null} />
      </Col>
      <Col md={12} sm={12} xs={12} className="text-right">
        <SeeMoreLInk href="/activities" />
      </Col>
    </Row>
  );
}

export default RecentActivitiesHeader;
