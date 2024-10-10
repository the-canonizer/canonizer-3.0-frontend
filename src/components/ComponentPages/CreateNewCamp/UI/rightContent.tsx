import { Typography } from "antd";

import CommonCards from "components/shared/Card";
import CampInfoIcon from "./campInfoIcon";

const CampInfoCard = () => {
  return (
    <CommonCards className="bg-topic-card-gr h-full [&_.ant-card-body]:h-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col">
      <header className="mb-14">
        <Typography.Paragraph className="text-canBlack font-semibold text-lg uppercase">
          What are Camps?
        </Typography.Paragraph>
        <Typography.Paragraph className="text-canBlack font-normal mt-3 opacity-80">
          A Camp on our platform refers to a specific subject within the context
          of the Topic inside a Canon. It serves as a focal point for
          discussions, allowing users to explore and share opinions, ideas, and
          arguments related to that particular subject.
        </Typography.Paragraph>
      </header>
      <CampInfoIcon className="mt-auto mx-auto max-w-lg w-full" />
    </CommonCards>
  );
};

export default CampInfoCard;
