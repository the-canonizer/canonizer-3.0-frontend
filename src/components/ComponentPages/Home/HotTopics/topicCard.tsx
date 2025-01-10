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
  avatars: PropTypes.array,
  scoreTag: PropTypes.any,
  onTopicLinkClick: PropTypes.func,
  tag_key: PropTypes.string,
  maxCount: PropTypes.number,
  cardClassName: PropTypes.string,
  copyLink: PropTypes.any,
  imageBaseURL: PropTypes.string,
  descriptionTextLength: PropTypes.number,
};

const SingleTopicCard = ({
  topic,
  avatars,
  scoreTag = null,
  onTopicLinkClick = null,
  tag_key = "tags",
  maxCount = 5,
  cardClassName = "",
  copyLink = null,
  imageBaseURL = "",
  descriptionTextLength = 220,
}) => {
  const isMobile = useIsMobile();

  if (!topic) {
    return null;
  }

  return (
    <Link
      href={`/topic/${topic?.topic_num}-${
        replaceSpecialCharacters(topic?.topic_name, "-") || ""
      }/${topic?.camp_num || 1}-${
        replaceSpecialCharacters(topic?.camp_name, "-") || "Agreement"
      }`}
      id={`link-${topic?.id}`}
    >
      <CommonCard
        className={
          "hover:cursor-pointer border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard [&_.ant-card-body]:before:hidden [&_.ant-card-body]:after:hidden [&_.ant-card-body]:p-[15px] " +
          cardClassName
        }
        key={topic?.id}
        id={`common-card-${topic?.id}`}
      >
        <div
          className="flex justify-between pb-3 items-center"
          onClick={onTopicLinkClick}
          id={`card-header-${topic?.id}`}
        >
          <Typography.Text
            id={`browse-topic-name-${topic?.id}`}
            className="flex w-11/12 items-center"
          >
            <Typography.Paragraph
              id={`topic-name-${topic?.id}`}
              className="m-0 text-sm 2xl:text-base font-medium font-inter !mb-0 line-clamp-1"
            >
              {topic?.topic_name}
            </Typography.Paragraph>
            <span id={`browse-topic-score-${topic?.id}`}>{scoreTag}</span>
            <span id={`browse-copy-link-${topic?.id}`}>
              {copyLink && copyLink}
            </span>
          </Typography.Text>
          <RightOutlined
            id={`right-arrow-${topic?.id}`}
            className="text-canBlue font-bold hidden rightArrow"
          />
        </div>
        <CardDescription
          className="topicDesc"
          description={topic?.statement?.parsed_value || topic?.statement}
          descriptionTextLength={descriptionTextLength}
        />
        <div
          className="flex justify-between mt-auto pt-5 flex-row items-center"
          id={`card-footer-${topic?.id}`}
        >
          <div
            className="catTags flex flex-col justify-center min-h-[32px]"
            id={`cat-tags-${topic?.id}`}
          >
            <TopicCatsLabel
              tags={topic[tag_key]}
              id={`topic-cats-label-${topic?.id}`}
            />
            <ViewCounts
              views={topic?.views}
              className={`${
                topic[tag_key]?.length ? "!mt-1" : ""
              } cardCountCls`}
              id={`view-counts-${topic?.id}`}
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
            imageBaseURL={imageBaseURL}
            id={`avatar-group-${topic?.id}`}
            haveShowMore={topic?.total_supporters_count}
          />
        </div>
      </CommonCard>
    </Link>
  );
};

SingleTopicCard.propTypes = propTypes;

export default SingleTopicCard;
