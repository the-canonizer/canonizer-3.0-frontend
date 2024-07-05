import { Fragment } from "react";
import { Typography, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import AvatarGroup from "src/components/shared/AvaratGroup";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import CardDescription from "../HotTopics/descriptions";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";

const PreferedTopics = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.preferedTopic,
  }));

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="Your preferred topics"
            infoContent="Your preferred topics"
          />
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk />
        </Col>
      </Row>

      <div className="mt-3">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topicData?.slice(0, 6)?.map((ft) => (
            <div className="mb-4 h-full" key={ft?.id}>
              <CommonCard
                className={`border-0 h-full hover:*:shadow-lg fullHeightCard`}
              >
                <div className="flex justify-between pb-2 align-center">
                  <Typography.Paragraph className="m-0 text-base font-medium font-inter">
                    {ft?.topic_name}
                  </Typography.Paragraph>
                  <div className="hidden hover:block">
                    <RightOutlined className="text-canBlack p-1 text-medium" />
                  </div>
                </div>
                <CardDescription description={ft?.statement?.value} />
                <div className="flex justify-between pt-3 mt-auto flex-row md:flex-row lg:flex-col 2xl:flex-row">
                  <div className="text-left flex flex-col">
                    <NameSpaceLabel namespace={ft?.namespace} />
                    <ViewCounts views={ft?.views} />
                  </div>
                  <AvatarGroup
                    avatars={ft?.supporterData}
                    size="large"
                    maxCount={3}
                    maxStyle={{
                      color: "#5482C8",
                      backgroundColor: "#fde3cf",
                    }}
                  />
                </div>
              </CommonCard>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default PreferedTopics;
