import { Row, Col } from "antd";
import Image from "next/image";

import SeeMoreLInk from "../../FeaturedTopic/seeMoreLink";
import SectionHeading from "../../FeaturedTopic/sectionsHeading";

function RecentActivitiesHeader({ isActivitiesPage, onBackClick }) {
  return isActivitiesPage ? (
    <Row gutter={15} id="activities-page-row">
      <Col md={24} sm={24} xs={24} id="activities-page-col">
        <div
          className="flex items-center gap-3.5 lg:!mb-10 mt-5 "
          onClick={onBackClick}
          id="activities-page-div"
        >
          <Image
            className="cursor-pointer"
            src="/images/recent-activiity-arrow.svg"
            width={20}
            height={20}
            alt="icon"
            id="activities-page-image"
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
    <Row gutter={15} id="default-page-row">
      <Col md={12} sm={12} xs={12} id="default-page-col-left">
        <SectionHeading title="Recent activities" infoContent="" icon={null} />
      </Col>
      <Col
        md={12}
        sm={12}
        xs={12}
        className="text-right"
        id="default-page-col-right"
      >
        <SeeMoreLInk href="/activities" />
      </Col>
    </Row>
  );
}

export default RecentActivitiesHeader;
