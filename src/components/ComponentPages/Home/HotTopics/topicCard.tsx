import { Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import PropTypes from "prop-types";

import CommonCard from "src/components/shared/Card";
import ViewCounts from "src/components/shared/ViewsCount";
import AvatarGroup from "src/components/shared/AvaratGroup";
import CardDescription from "./descriptions";
import TopicCatsLabel from "components/shared/TopicCategories";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const propTypes = {
  topic: PropTypes.object,
};

const SingleTopicCard = ({ topic }) => {
  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className="border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard [&_.ant-card-body]:before:hidden"
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
        <a className="flex justify-between pb-3 items-center">
          <Typography.Paragraph className="m-0 text-base font-medium font-inter !mb-0">
            {topic?.topic_name}
          </Typography.Paragraph>
          <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
        </a>
      </Link>
      <CardDescription description={topic?.statement?.parsed_value} />
      <div className="flex justify-between mt-auto pt-5 mt-auto flex-row md:flex-row lg:flex-col 2xl:flex-row">
        <div className="text-letopic flex flex-col">
          <TopicCatsLabel tags={topic?.topicTags} />
          <ViewCounts views={topic?.views} className="!mt-2" />
        </div>
        <AvatarGroup
          avatars={topic?.supporterData?.slice(0, 3)}
          size="large"
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
