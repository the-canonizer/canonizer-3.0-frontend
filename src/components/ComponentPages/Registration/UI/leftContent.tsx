import { useRouter } from "next/router";
import { Typography, Image, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import Headings from "src/components/shared/Typography";

const LeftContent = () => {
  const router = useRouter();

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Button
        type="link"
        className="h-[50px] text-base w-2/12 text-black flex items-center justify-start text-base font-medium p-0 mb-4"
        onClick={onBrowseClick}
      >
        <LeftOutlined /> Go Back
      </Button>
      <Typography.Paragraph className="m-0 text-base font-bold font-inter">
        Welcome to
      </Typography.Paragraph>
      <Headings h1 className="mb-1 leading-[1.1]">
        Canonizer
      </Headings>
      <Image
        src="/images/middle-vector.svg"
        className="w-full h-auto"
        preview={false}
        wrapperClassName="mt-auto"
      />
    </div>
  );
};

export default LeftContent;
