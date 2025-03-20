import { Fragment } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Layout, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import useAuthentication from "src/hooks/isUserAuthenticated";
import { RootState } from "src/store";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import { useClearCache } from "react-clear-cache";
// import PrimaryButton from "components/shared/Buttons/PrimariButton";

const { Text, Paragraph } = Typography;

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

const WelcomeContent = () => {
  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/browse" });
  };

  // const onTopicClick = (e) => {
  //   e?.preventDefault();
  //   router?.push({ pathname: "/create/topic" });
  // };
  const { emptyCacheStorage } = useClearCache();

  return (
    <Layout id="welcome-layout" className="bg-canGray rounded-lg py-6 px-6 ">
      <div
        id="welcome-container"
        className="pr-0 w-full h-full flex flex-wrap items-center justify-start gap-4 lg:gap-6"
      >
        <Paragraph id="welcome-greeting" className="!m-0 text-xl font-normal">
          {isUserAuthenticated ? (
            <Fragment>
              {getGreet()},{" "}
              <Text id="user-name" className="font-semibold">
                {loggedInUser?.first_name}
              </Text>
              !
            </Fragment>
          ) : (
            <Fragment>
              Welcome to{" "}
              <Text id="site-name" className="font-semibold">
                Canonizer
              </Text>
            </Fragment>
          )}
        </Paragraph>
        <Paragraph
          id="welcome-message"
          className={`text-sm font-normal !m-0 lg:w-4/12`}
        >
          {isUserAuthenticated
            ? "Welcome back! Explore topics, build consensus, and track conclusions on the go."
            : "A consensus building and tracking system and decision making tool you can use for Dynamic Surveying."}
        </Paragraph>
        <SecondaryButton
          id="browse-button"
          className="lg:h-[40px] text-sm px-5 md:px-20 flex items-center justify-center lg:ml-auto"
          onClick={onBrowseClick}
        >
          Browse More <ArrowRightOutlined />
        </SecondaryButton>
      </div>
    </Layout>
  );
};

export default WelcomeContent;
