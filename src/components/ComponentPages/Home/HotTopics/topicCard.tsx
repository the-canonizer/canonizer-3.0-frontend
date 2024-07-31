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
  onTopicLinkClick = null,
  topic_name_key = "topic_name",
  tag_key = "topicTags",
  avatar_key = "supporterData",
}) => {
  const isMobile = useIsMobile();

  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className="border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard [&_.ant-card-body]:before:hidden [&_.ant-card-body]:after:hidden"
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
          <Typography.Paragraph className="m-0 text-base font-medium font-inter !mb-0">
            {topic[topic_name_key]}
          </Typography.Paragraph>
          <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
        </a>
      </Link>
      <CardDescription
        description={topic?.statement?.parsed_value || topic?.statement}
      />
      <div className="flex justify-between mt-auto pt-5 mt-auto flex-row items-center">
        <div className="text-letopic flex flex-col justify-center">
          <TopicCatsLabel tags={topic[tag_key]} />
          <ViewCounts
            views={topic?.views}
            className={`${topic[tag_key]?.length ? "!mt-2" : ""}`}
          />
        </div>
        <AvatarGroup
          avatars={topic[avatar_key]?.slice(0, 3)}
          size={isMobile ? "small" : "large"}
          maxCount={3}
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
