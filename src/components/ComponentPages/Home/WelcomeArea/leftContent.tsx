import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import TopicCreateButton from "src/components/shared/Buttons/TopicCreationButton";
import { RootState } from "src/store";

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

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/browse" });
  };

  return (
    <div className="pr-0">
      <Typography.Paragraph className="m-0 text-base font-bold font-inter">
        {isUserAuthenticated
          ? getGreet() + ", " + loggedInUser?.first_name + "!"
          : "Welcome to"}
      </Typography.Paragraph>
      {!isUserAuthenticated ? (
        <Headings h1 className="mb-1 leading-[1.1]">
          Canonizer
        </Headings>
      ) : (
        <br />
      )}
      <Typography.Paragraph className="text-base font-inter font-normal mb-3">
        {isUserAuthenticated
          ? "Here are some quick stats for you -"
          : "A consensus building and tracking system and decision making tool you can use for Dynamic Surveying."}
      </Typography.Paragraph>
      {isUserAuthenticated ? (
        <TopicCreateButton
          className="w-4/12 h-[50px] text-base bg-blue px-3 rounded-lg text-white hover:bg-hblue hover:text-white flex items-center justify-center font-medium lg:w-8/12 md:w-6/12 sm:w-full"
          isWithIcon={true}
        />
      ) : (
        <PrimaryButton
          className="w-4/12 h-[50px] text-base lg:w-8/12 md:w-6/12 sm:w-full"
          onClick={onBrowseClick}
        >
          Browse More <ArrowRightOutlined />
        </PrimaryButton>
      )}
    </div>
  );
};

export default LeftContent;
