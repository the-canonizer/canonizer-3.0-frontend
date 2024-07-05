import { Fragment } from "react";
import { Typography, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";

import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import AvatarGroup from "src/components/shared/AvaratGroup";
import CardDescription from "./descriptions";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";

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
        <Col md={12} sm={12} xs={12}>
          <SectionHeading title="Hot Topics" infoContent="Hot Topics" />
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk />
        </Col>
      </Row>

      <Row className="mt-4" gutter={[24, 24]}>
        {topicData?.map((ft) => (
          <Col md={12} lg={8} xs={24} sm={24} key={ft?.id}>
            <CommonCard
              className="border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full"
              key={ft?.id}
            >
              <Link
                href={{
                  pathname: `/topic/${ft?.topic_num}-${ft?.topic_name || ""}/${
                    ft?.camp_num || 1
                  }-${ft?.camp_name || "Agreement"}`,
                }}
              >
                <a className="flex justify-between pb-3 items-center">
                  <Typography.Paragraph className="m-0 text-base font-medium font-inter">
                    {ft?.topic_name}
                  </Typography.Paragraph>
                  <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
                </a>
              </Link>
              <CardDescription description={ft?.statement?.value} />
              <div className="flex justify-between mt-auto pt-3 mt-auto flex-row md:flex-row lg:flex-col 2xl:flex-row">
                <div className="text-left flex flex-col">
                  <NameSpaceLabel namespace={ft?.namespace} />
                  <ViewCounts views={ft?.views} className="!mt-2" />
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
