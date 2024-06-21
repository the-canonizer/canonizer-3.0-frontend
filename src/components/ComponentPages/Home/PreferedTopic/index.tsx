import { Fragment } from "react";
import { Typography, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import AvatarGroup from "src/components/shared/AvaratGroup";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import CardDescription from "../HotTopics/descriptions";

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
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-14 font-bold uppercase">
            Your preferred topics{" "}
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <div className="mt-1">
        <Row gutter={20} className="items-stretch">
          {topicData?.slice(0, 6)?.map((ft) => (
            <Col
              xl={8}
              lg={12}
              md={24}
              xs={24}
              className="mb-4 self-stretch h-[250px] xl:h-full"
              key={ft?.id}
            >
              <CommonCard
                className={`border-0 h-full hover:*:shadow-lg fullHeightCard`}
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
                <div className="flex justify-between pt-3 mt-auto xl:flex-col sm:flex-col">
                  <div className="text-left flex flex-col">
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
      </div>
    </Fragment>
  );
};

export default PreferedTopics;
