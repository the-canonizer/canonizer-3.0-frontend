import { Fragment } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import Headings from "@/components/shared/Typography";
import CommonCard from "@/components/shared/Card";
import { RootState } from "src/store";

const WhatsNew = () => {
  const { whatsNew } = useSelector((state: RootState) => ({
    whatsNew: state.homePage?.whatsNew,
  }));

  return (
    <Fragment>
      <Row gutter={15} className="mt-5">
        <Col md={24} className="mb-3">
          <Headings
            level={5}
            className="mb-0 text-base font-bold uppercase"
          >
            WHAT’S NEW AT CANONIZER?
          </Headings>
        </Col>
      </Row>

      <div className="">
        <CommonCard className="border-0 h-100 hover:*:bg-gr focus:*:bg-gr">
          <div dangerouslySetInnerHTML={{ __html: whatsNew }}></div>
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default WhatsNew;
