import { Typography, Row, Col, Image } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";

import { isServer, replaceSpecialCharacters } from "src/utils/generalUtility";
import CommonCard from "components/shared/Card";
import AvatarGroup from "components/shared/AvaratGroup";
import ViewCounts from "components/shared/ViewsCount";
import CardDescription from "../HotTopics/descriptions";
import SocialShare from "components/shared/ShareTopic";
import TopicCatsLabel from "components/shared/TopicCategories";

const propTypes = {
  topic: PropTypes.object,
  onTopicClick: PropTypes.func,
  descriptionTextLength: PropTypes.number,
};

const SingleTopicWithImage = ({
  topic,
  onTopicClick = null,
  descriptionTextLength = 400,
}) => {
  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className="bg-canGray w-full p-0 [&>.ant-card-body]:p-0 xl:[&>.ant-card-body]:py-4 xl:[&>.ant-card-body]:px-4 [&_.ant-card-body]:before:hidden"
      key={topic?.id}
      id={`common-card-${topic?.id}`}
    >
      <Row
        gutter={0}
        className="w-full min-w-full max-w-full relative"
        id={`row-${topic?.id}`}
      >
        <Col
          xl={10}
          lg={24}
          md={24}
          xs={24}
          className="before:content-[''] before:bg-custom-gradient relative before:absolute before:w-full before:h-full z-0 before:z-10 lg:before:hidden"
          id={`col-image-${topic?.id}`}
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
            id={`link-image-${topic?.id}`}
            onClick={onTopicClick}
          >
              <Image
                alt={topic?.topic_name}
                className="w-full rounded-lg object-cover h-full max-h-[200px] 2xl:max-h-[250px]"
                preview={false}
                height={"100%"}
                width={"100%"}
                src={topic?.file_full_path}
                rootClassName="h-full"
                style={{ aspectRatio: 2 / 2 }}
                id={`image-${topic?.id}`}
              />
          </Link>
        </Col>
        <Col
          xl={14}
          lg={24}
          md={24}
          xs={24}
          className="flex flex-col mt-3 xl:mt-0 md:pl-4 px-3 pb-5 xl:px-7 xl:pb-0 static xl:!pr-0"
          id={`col-content-${topic?.id}`}
        >
          <div
            className="flex justify-between pb-4 align-center z-100 relative -ml-4 -mr-4 lg:ml-0 lg:mr-0"
            id={`div-title-${topic?.id}`}
          >
            <Link
              href={{
                pathname: `/topic/${
                  topic?.topic_num
                }-${replaceSpecialCharacters(topic?.topic_name, "-")}/${
                  topic?.camp_num
                }-${replaceSpecialCharacters(topic?.camp_name, "-")}`,
              }}
              id={`link-title-${topic?.id}`}
              onClick={onTopicClick}
            >

                <Typography.Paragraph
                  className="m-0 text-base lg:text-xl font-medium lg:font-semibold font-inter absolute -top-14 left-1 right-0 text-white px-3 py-0 !mb-0 flex w-full lg:static lg:px-0 lg:py-0 lg:text-canBlack hover:!text-canHoverBlue"
                  id={`paragraph-title-${topic?.id}`}
                >
                  {topic?.title}
                </Typography.Paragraph>
            </Link>
            <div
              className="hidden lg:flex items-start justify-center [&_.ant-dropdown-trigger>svg]:fill-canLight [&_.ant-dropdown-trigger>svg]:!text-canLight [&_.ant-dropdown-trigger>svg]:w-[14px] [&_.ant-dropdown-trigger>svg]:h-[14px]"
              id={`div-social-share-${topic?.id}`}
            >
              <SocialShare
                key={topic?.id}
                campName={topic?.camp_name}
                campUrl={!isServer() && window?.location?.href}
              />
            </div>
          </div>
          <CardDescription
            description={topic?.description}
            descriptionTextLength={descriptionTextLength}
            className="mb-6"
          />
          <div
            className="flex justify-between pt-3 mt-auto ftItems"
            id={`div-footer-${topic?.id}`}
          >
            <div
              className="text-left flex flex-col sm:flex-row justify-center items-center"
              id={`div-tags-${topic?.id}`}
            >
              {topic?.topicTags?.length && (
                <TopicCatsLabel
                  tags={topic?.topicTags}
                  id={`topic-cats-label-${topic?.id}`}
                />
              )}
              <div
                className="absolute top-2 right-2 px-2 rounded-md bg-canBlack lg:static lg:bg-transparent lg:px-0 lg:flex"
                id={`div-view-counts-${topic?.id}`}
              >
                <ViewCounts
                  views={topic?.views}
                  id={`view-counts-${topic?.id}`}
                />
              </div>
            </div>
            <AvatarGroup
              avatars={topic?.supporterData?.slice(0, 5)}
              size="medium"
              maxStyle={{
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              }}
              maxCount={5}
              maxPopoverTrigger="click"
              id={`avatar-group-${topic?.id}`}
              haveShowMore={topic?.total_supporters_count}
            />
          </div>
        </Col>
      </Row>
    </CommonCard>
  );
};

SingleTopicWithImage.propTypes = propTypes;

export default SingleTopicWithImage;
