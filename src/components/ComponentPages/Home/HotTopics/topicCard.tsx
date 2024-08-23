import { Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import PropTypes from "prop-types";

import CommonCard from "components/shared/Card";
import ViewCounts from "components/shared/ViewsCount";
import AvatarGroup from "components/shared/AvaratGroup";
import CardDescription from "./descriptions";
import TopicCatsLabel from "components/shared/TopicCategories";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { useIsMobile } from "src/hooks/useIsMobile";

const propTypes = {
  topic: PropTypes.object,
};

const SingleTopicCard = ({
  topic,
  avatars,
  scoreTag = null,
  onTopicLinkClick = null,
  tag_key = "topicTags",
  maxCount = 3,
  cardClassName = "",
}) => {
  const isMobile = useIsMobile();

  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className={
        "border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard [&_.ant-card-body]:before:hidden [&_.ant-card-body]:after:hidden [&_.ant-card-body]:p-[15px] " +
        cardClassName
      }
      key={topic?.id}
    >
      <Link
        href={{
          pathname: `/topic/${topic?.topic_num}-${
            replaceSpecialCharacters(topic?.topic_name, "-") || ""
          }/${topic?.camp_num || 1}-${
            replaceSpecialCharacters(topic?.camp_name, "-") || "Agreement"
          }`,
        }}
      >
        <a
          className="flex justify-between pb-3 items-center"
          onClick={onTopicLinkClick}
        >
          <Typography.Text className="flex w-11/12 items-center">
            <Typography.Paragraph className="m-0 text-sm 2xl:text-base font-medium font-inter !mb-0 line-clamp-1">
              {topic?.topic_name}
            </Typography.Paragraph>
            {scoreTag}
          </Typography.Text>
          <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
        </a>
      </Link>
      <CardDescription
        className="topicDesc"
        description={topic?.statement?.parsed_value || topic?.statement}
      />
      <div className="flex justify-between mt-auto pt-5 mt-auto flex-row items-center">
        <div className="catTags flex flex-col justify-center min-h-[32px]">
          <TopicCatsLabel tags={topic[tag_key]} />
          <ViewCounts
            views={topic?.views}
            className={`${topic[tag_key]?.length ? "!mt-1" : ""} cardCountCls`}
          />
        </div>
        <AvatarGroup
          avatars={avatars}
          size={isMobile ? "small" : "medium"}
          maxCount={maxCount}
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
          }}
        />
      </div>
    </CommonCard>
  );
};

SingleTopicCard.propTypes = propTypes;

export default SingleTopicCard;
