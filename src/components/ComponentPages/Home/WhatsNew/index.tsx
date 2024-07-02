import { Fragment } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";

const WhatsNew = () => {
  const { whatsNew } = useSelector((state: RootState) => ({
    whatsNew: state.homePage?.whatsNew,
  }));

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={24}>
          <SectionHeading
            title=" WHAT’S NEW AT CANONIZER?"
            infoContent=""
            icon={null}
          />
        </Col>
      </Row>

      <div className="mt-3">
        <CommonCard className="border-0 h-100 text-canBlack">
          <div
            className="text-canBlack"
            dangerouslySetInnerHTML={{ __html: whatsNew }}
          ></div>
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default WhatsNew;
