import { Typography, Image, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import Headings from "src/components/shared/Typography";

const LeftContent = ({ onBrowseClick }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Button
        type="link"
        className="h-[50px] text-sm w-2/12 text-canBlack flex items-start justify-start text-sm font-medium p-0 mb-4"
        onClick={onBrowseClick}
      >
        <LeftOutlined /> Go Back
      </Button>
      <div className="my-auto">
        <Headings h1 className="mb-6 leading-[1.1] font-medium">
          Welcome Back to Canonizer
        </Headings>
        <Typography.Paragraph className="text-2xl !mb-5 font-medium font-inter">
          Continue Shaping Collective Thought
        </Typography.Paragraph>
        <Typography.Paragraph className="text-sm font-normal text-canBlack opacity-80 font-inter xl:w-9/12">
          Log in to participate in ongoing discussions, refine consensus, and
          collaborate with others to influence impactful decisions on vital
          issues.
        </Typography.Paragraph>
        <div className="text-center ftImage">
          <Image
            src="/images/middle-vector.svg"
            className="w-10/12"
            preview={false}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftContent;
