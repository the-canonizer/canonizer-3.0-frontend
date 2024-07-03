import { Col, Layout, Row } from "antd";

import LeftContent from "./leftContent";
import RightContent from "./rightContent";
import useAuthentication from "src/hooks/isUserAuthenticated";

const WelcomeContent = () => {
  const { isUserAuthenticated } = useAuthentication();

  let bgmain = {};

  if (isUserAuthenticated) {
    bgmain = {
      backgroundImage: `url('/images/bg.svg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return (
    <Layout
      className="bg-canGray rounded-lg p-6"
      style={isUserAuthenticated ? bgmain : null}
    >
      <Row
        gutter={20}
        className={`z-0 ${
          isUserAuthenticated
            ? "relative before:content-[''] z-1 before:w-full before:h-full before:absolute before:block before:bg-[url('/images/middle-vector.svg')] before:bg-no-repeat before:bottom-[-25px] before:left-[50%] before:translate-x-[-50%] before:w-full before:bg-[length:200px_200px] lg:before:bg-[length:300px_200px] before:bg-right-top md:before:bg-center lg:before:bg-center"
            : ""
        }`}
      >
        <Col lg={12} md={24} data-testid="leftContent">
          <LeftContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
        <Col
          lg={12}
          md={24}
          className={`hidden md:block mt-4 lg:mt-0`}
          data-testid="rightContent"
        >
          <RightContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
      </Row>
    </Layout>
  );
};

export default WelcomeContent;
