import { Fragment } from "react";
import { Popover, Typography, Row, Col } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import AvatarGroup from "src/components/shared/AvaratGroup";
import CardDescription from "./descriptions";

const HotTopics = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-14 font-bold uppercase">
            Hot Topics{" "}
            <Popover content="Hot Topics" placement="top" className="">
              <InfoCircleOutlined />
            </Popover>
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="#">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <Row className="mt-0" gutter={20}>
        {topicData?.map((ft) => (
          <Col md={12} lg={8} xs={24} sm={24}>
            <CommonCard
              className="border-0 h-full mb-4 [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full"
              key={ft?.id}
            >
              <div className="flex justify-between pb-2 align-center">
                <Typography.Paragraph className="m-0 text-medium font-bold font-inter">
                  {ft?.topic_name}
                </Typography.Paragraph>
                <div className="hidden hover:block">
                  <RightOutlined className="text-black p-1 text-medium" />
                </div>
              </div>
              <CardDescription description={ft?.statement?.value} />
              <div className="flex justify-between mt-auto pt-3 mt-auto 1xl:flex-col">
                <div className="text-left flex 2xl:flex-col sm:flex-col">
                  <NameSpaceLabel namespace={ft?.namespace} />
                  <ViewCounts views={ft?.views} />
                </div>
                <AvatarGroup
                  avatars={ft?.supporterData}
                  size="large"
                  maxCount={3}
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  }}
                />
              </div>
            </CommonCard>
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default HotTopics;
