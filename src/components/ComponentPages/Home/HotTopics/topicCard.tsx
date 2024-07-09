import { Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";

import CommonCard from "src/components/shared/Card";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import AvatarGroup from "src/components/shared/AvaratGroup";
import CardDescription from "./descriptions";

const SingleTopicCard = ({ topic }) => {
  if (!topic) {
    return null;
  }

  return (
    <CommonCard
      className="border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard"
      key={topic?.id}
    >
      <Link
        href={{
          pathname: `/topic/${topic?.topic_num}-${topic?.topic_name || ""}/${
            topic?.camp_num || 1
          }-${topic?.camp_name || "Agreement"}`,
        }}
      >
        <a className="flex justify-between pb-3 items-center">
          <Typography.Paragraph className="m-0 text-base font-medium font-inter !mb-0">
            {topic?.topic_name}
          </Typography.Paragraph>
          <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
        </a>
      </Link>
      <CardDescription description={topic?.statement?.value} />
      <div className="flex justify-between mt-auto pt-5 mt-auto flex-row md:flex-row lg:flex-col 2xl:flex-row">
        <div className="text-letopic flex flex-col">
          <NameSpaceLabel namespace={topic?.namespace} />
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

export default SingleTopicCard;
