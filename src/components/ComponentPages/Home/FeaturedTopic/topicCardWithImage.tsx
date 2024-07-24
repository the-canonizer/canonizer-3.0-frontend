import { Typography, Row, Col, Image } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";

import { isServer, replaceSpecialCharacters } from "src/utils/generalUtility";
import CommonCard from "src/components/shared/Card";
import AvatarGroup from "src/components/shared/AvaratGroup";
import ViewCounts from "src/components/shared/ViewsCount";
import CardDescription from "../HotTopics/descriptions";
import SocialShare from "components/shared/ShareTopic";
import TopicCatsLabel from "components/shared/TopicCategories";

const propTypes = {
  topic: PropTypes.object,
};

const SingleTopicWithImage = ({ topic, onTopicClick = null }) => {
  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className="bg-canGray w-full p-0 [&>.ant-card-body]:p-0 xl:[&>.ant-card-body]:py-5 xl:[&>.ant-card-body]:px-8 [&_.ant-card-body]:before:hidden"
      key={topic?.id}
    >
      <Row gutter={0} className="w-full min-w-full max-w-full relative">
        <Col
          xl={8}
          lg={24}
          md={24}
          xs={24}
          className="before:content-[''] before:bg-custom-gradient relative before:absolute before:w-full before:h-full z-0 before:z-10 lg:before:hidden"
        >
          <Link
            href={{
              pathname: `/topic/${topic?.topic_num}-${replaceSpecialCharacters(
                topic?.topic_name,
                "-"
              )}/${topic?.camp_num}-${replaceSpecialCharacters(
                topic?.camp_name,
                "-"
              )}`,
            }}
          >
            <a onClick={onTopicClick}>
              <Image
                alt={topic?.topic_name}
                className="w-full rounded-lg h-auto object-cover h-full min-h-28 md:min-h-60 max-h-48 md:max-h-72"
                preview={false}
                height={"100%"}
                width={"100%"}
                src={topic?.file_full_path}
                rootClassName="h-full"
              />
            </a>
          </Link>
        </Col>
        <Col
          xl={16}
          lg={24}
          md={24}
          xs={24}
          className="flex flex-col mt-3 xl:mt-0 md:pl-4 px-3 pb-5 xl:px-7 xl:pb-0 static xl:!pr-0"
        >
          <div className="flex justify-between pb-4 align-center z-100 relative -ml-4 -mr-4 lg:ml-0 lg:mr-0">
            <Link
              href={`/topic/${topic?.topic_num}-${replaceSpecialCharacters(
                topic?.topic_name,
                "-"
              )}/${topic?.camp_num}-${replaceSpecialCharacters(
                topic?.camp_name,
                "-"
              )}`}
            >
              <a onClick={onTopicClick}>
                <Typography.Paragraph className="m-0 text-base lg:text-xl font-medium lg:font-bold font-inter absolute -top-14 left-1 right-0 text-white px-3 py-0 !mb-0 flex w-full lg:static lg:px-0 lg:py-0 lg:text-canBlack hover:!text-canHoverBlue">
                  {topic?.title}
                </Typography.Paragraph>
              </a>
            </Link>
            <div className="hidden lg:flex items-start justify-center">
              <SocialShare
                key={topic?.id}
                campName={topic?.camp_name}
                campUrl={!isServer() && window?.location?.href}
              />
            </div>
          </div>
          <CardDescription description={topic?.description} />
          <div className="flex justify-between pt-3 mt-auto">
            <div className="text-left flex flex-col sm:flex-row justify-end">
              <TopicCatsLabel tags={topic?.topicTags} />
              <div className="absolute top-2 right-2 px-2 rounded-md bg-canBlack lg:static lg:bg-transparent lg:px-0 lg:flex">
                <ViewCounts views={topic?.views} />
              </div>
            </div>
            <AvatarGroup
              avatars={topic?.supporterData?.slice(0, 5)}
              size="large"
              maxStyle={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              }}
              maxCount={5}
              maxPopoverTrigger="click"
            />
          </div>
        </Col>
      </Row>
    </CommonCard>
  );
};

SingleTopicWithImage.propTypes = propTypes;

export default SingleTopicWithImage;
