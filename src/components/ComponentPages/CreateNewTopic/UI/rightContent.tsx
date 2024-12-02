import { Typography } from "antd";

import CommonCards from "components/shared/Card";
import InfoIcon from "./infoIcon";

const TopicInfoCard = () => {
  return (
    <CommonCards
      id="common-cards"
      className="bg-topic-card-gr h-full border-canGrey2 [&_.ant-card-body]:h-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col mt-[20px]"
    >
      <header id="header" className="mb-14">
        <Typography.Paragraph
          id="topic-title"
          className="text-canBlack font-semibold text-lg uppercase"
        >
          What are Topics?
        </Typography.Paragraph>
        <Typography.Paragraph
          id="topic-description"
          className="text-canBlack font-normal mt-3 opacity-80"
        >
          A topic on our platform refers to a specific subject within the
          context of the canon. It serves as a focal point for discussions,
          allowing users to explore and share opinions, ideas, and arguments
          related to that particular subject.
        </Typography.Paragraph>
      </header>
      <InfoIcon className="my-auto mx-auto max-w-xl w-full" />
    </CommonCards>
  );
};

export default TopicInfoCard;
