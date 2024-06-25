import { Typography } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/router";

import PrimaryButton from "src/components/shared/Buttons/PrimariButton";

const RightContent = ({ isUserAuthenticated }) => {
  const router = useRouter();

  const onPlayClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/videos/consciousness" });
  };

  return (
    <div
      className={`pr-0 text-center ${
        isUserAuthenticated ? "lg:w-[70%] ml-auto" : "w-full"
      } h-auto pt-3 mt-4 md:mt-0 md:h-full md:pb-0 pb-4 ${
        isUserAuthenticated ? "bg-white" : "bg-white"
      } z-[1000] relative rounded-xl`}
    >
      <Typography.Paragraph className="m-0 text-xl font-inter">
        {isUserAuthenticated ? "For Existing Users" : "For Guest User"}
      </Typography.Paragraph>
      <PrimaryButton
        className="w-auto h-auto leading-0 p-0 rounded-full !bg-transparent border-0 mb-3"
        onClick={onPlayClick}
      >
        <PlayCircleFilled
          className={`${
            isUserAuthenticated ? "text-canRed" : "text-canBlue"
          } text-5xl`}
        />
      </PrimaryButton>
      <Typography.Paragraph className="text-sm font-inter font-normal mb-3">
        {isUserAuthenticated
          ? "show them how to use to it’s maximum potential"
          : "explain what Canonizer is at a beginner level, and how it can be used"}
      </Typography.Paragraph>
    </div>
  );
};

export default RightContent;
