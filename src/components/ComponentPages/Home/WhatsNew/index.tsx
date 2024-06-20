import { Fragment } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";

const WhatsNew = () => {
  const { whatsNew } = useSelector((state: RootState) => ({
    whatsNew: state.homePage?.whatsNew,
  }));

  return (
    <Fragment>
      <Row gutter={15} className="mt-5">
        <Col md={24} className="mb-3">
          <Headings level={5} className="mb-0 text-14 font-bold uppercase">
            WHAT’S NEW AT CANONIZER?
          </Headings>
        </Col>
      </Row>

      <div className="">
        <CommonCard className="border-0 h-100 hover:*:bg-gr hover:*:shadow-0 focus:*:bg-gr hover:*:text-black text-black">
          <div
            className="text-black"
            dangerouslySetInnerHTML={{ __html: whatsNew }}
          ></div>
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default WhatsNew;
