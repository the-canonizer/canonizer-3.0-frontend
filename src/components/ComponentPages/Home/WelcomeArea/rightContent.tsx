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
      className={`pr-0 sm:pr-0 text-center ${
        isUserAuthenticated ? "w-[70%] ml-auto" : "w-full"
      } h-full pt-3 md:mt-4 md:h-auto md:pb-4 ${
        isUserAuthenticated ? "bg-white" : "bg-white"
      } z-[1000] relative rounded-xl`}
    >
      <Typography.Paragraph className="m-0 text-medium font-medium font-inter">
        {isUserAuthenticated ? "For Existing Users" : "For Guest User"}
      </Typography.Paragraph>
      <PrimaryButton
        className="w-auto h-auto leading-null p-0 rounded-full bg-transparent border-0 hover:bg-transparent focus:bg-transparent mb-3"
        onClick={onPlayClick}
      >
        <PlayCircleFilled
          className={`p-0 ${
            isUserAuthenticated ? "text-red" : "text-blue"
          } text-2xl`}
        />
      </PrimaryButton>
      <Typography.Paragraph className="text-14 font-inter font-normal mb-3">
        {isUserAuthenticated
          ? "show them how to use to it’s maximum potential"
          : "explain what Canonizer is at a beginner level, and how it can be used"}
      </Typography.Paragraph>
    </div>
  );
};

export default RightContent;
