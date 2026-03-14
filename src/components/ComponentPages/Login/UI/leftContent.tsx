import { Typography, Image, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import Headings from "src/components/shared/Typography";

const LeftContent = ({ onBrowseClick }) => {
  return (
    <div id="left-content-container" className="w-full h-full flex flex-col">
      <Button
        id="go-back-button"
        type="link"
        className="h-[50px] text-sm w-2/12 text-canBlack flex items-center justify-start text-sm font-medium p-0 mb-4"
        onClick={onBrowseClick}
      >
        <LeftOutlined /> Back
      </Button>
      <div id="main-content" className="my-auto"></div>
      <Headings
        id="welcome-heading"
        h1
        className="mb-6 leading-[1.1] font-medium"
      >
        Welcome Back to Canonizer
      </Headings>
      <Typography.Paragraph
        id="subheading"
        className="text-2xl !mb-5 font-medium font-inter"
      >
        Continue Shaping Collective Thought
      </Typography.Paragraph>
      <Typography.Paragraph
        id="description"
        className="text-sm font-normal text-canBlack opacity-80 font-inter xl:w-9/12"
      >
        Log in to participate in ongoing discussions, refine consensus, and
        collaborate with others to influence impactful decisions on vital
        issues.
      </Typography.Paragraph>
      <div id="image-container" className="text-center ftImage">
        <Image
          id="main-image"
          src="/images/middle-vector.svg"
          className="w-10/12"
          preview={false}
        />
      </div>
    </div>
  );
};

export default LeftContent;
