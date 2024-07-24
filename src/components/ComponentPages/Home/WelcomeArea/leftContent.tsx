import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import TopicCreateButton from "src/components/shared/Buttons/TopicCreationButton";
import { RootState } from "src/store";
import { useIsMobile } from "src/hooks/useIsMobile";

const getGreet = () => {
  const d = new Date();
  const time = d.getHours();

  let greet = "";

  if (time < 12) {
    greet = "Good morning";
  } else if (time < 18) {
    greet = "Good afternoon";
  } else {
    greet = "Good evening";
  }

  return greet;
};

const LeftContent = ({ isUserAuthenticated }) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/browse" });
  };

  return (
    <div className="pr-0 w-full h-full flex flex-col">
      <Typography.Paragraph
        className={`m-0 ${
          isUserAuthenticated ? "text-lg font-semibold" : "text-md font-medium"
        } font-inter leading-[1]`}
      >
        {isUserAuthenticated
          ? getGreet() + ", " + loggedInUser?.first_name + "!"
          : "Welcome to"}
      </Typography.Paragraph>
      {!isUserAuthenticated ? (
        <Headings h1 className="mb-1 leading-[1.1]">
          Canonizer
        </Headings>
      ) : null}
      <Typography.Paragraph
        className={`text-sm font-inter font-normal mb-3 ${
          isUserAuthenticated ? "" : "mt-3"
        }`}
      >
        {isUserAuthenticated
          ? "Welcome back! Explore topics, build consensus, and track conclusions on the go."
          : "A consensus building and tracking system and decision making tool you can use for Dynamic Surveying."}
      </Typography.Paragraph>
      {isUserAuthenticated ? (
        <TopicCreateButton
          className={`w-6/12 h-[44px] text-sm bg-canBlue px-3 rounded-lg text-white hover:bg-canHoverBlue hover:text-white flex items-center justify-center font-medium md:w-4/12 mt-auto ${
            isMobile
              ? "bg-transparent !text-canBlue px-0 w-5/12 !text-base !text-left"
              : ""
          }`}
          isWithIcon={true}
        />
      ) : (
        <PrimaryButton
          className="w-6/12 h-[44px] text-sm md:w-4/12 mt-3"
          onClick={onBrowseClick}
        >
          Browse More <ArrowRightOutlined />
        </PrimaryButton>
      )}
    </div>
  );
};

export default LeftContent;
