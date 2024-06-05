import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import Headings from "@/components/shared/Typography";
import PrimaryButton from "@/components/shared/Buttons/PrimariButton";
import TopicCreateButton from "@/components/shared/Buttons/TopicCreationButton";
import { useSelector } from "react-redux";
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
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  return (
    <div className="pr-96">
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
          ? "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          : "A consensus building and tracking system and decision making tool you can use for Dynamic Surveying."}
      </Typography.Paragraph>
      {isUserAuthenticated ? (
        <TopicCreateButton
          className="w-4/12 h-[50px] text-base bg-blue px-3 rounded-lg text-white hover:bg-hblue hover:text-white flex items-center justify-center font-medium"
          isWithIcon={true}
        />
      ) : (
        <PrimaryButton className="w-4/12 h-[50px] text-base">
          Browse More <ArrowRightOutlined />
        </PrimaryButton>
      )}
    </div>
  );
};

export default LeftContent;
