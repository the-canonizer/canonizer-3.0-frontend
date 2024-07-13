import { Typography, Image, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import Headings from "src/components/shared/Typography";

const LeftContent = ({ onBrowseClick }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Button
        type="link"
        className="h-[50px] text-sm w-2/12 text-canBlack flex items-center justify-start text-sm font-medium p-0 mb-4"
        onClick={onBrowseClick}
      >
        <LeftOutlined /> Go Back
      </Button>
      <Typography.Paragraph className="text-sm font-bold font-inter">
        Welcome to
      </Typography.Paragraph>
      <Headings h1 className="mb-1 leading-[1.1]">
        Canonizer
      </Headings>
      <Typography.Paragraph className="text-sm font-normal text-canBlack font-inter">
        Enter the best leaderless consensus building and tracking system in the
        world.
      </Typography.Paragraph>
      <div className="text-center mt-auto -mb-7">
        <Image
          src="/images/middle-vector.svg"
          className="w-auto"
          preview={false}
          wrapperClassName="mt-auto"
        />
      </div>
    </div>
  );
};

export default LeftContent;
