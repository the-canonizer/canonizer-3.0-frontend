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
      className="bg-gr rounded-lg p-4"
      style={isUserAuthenticated ? bgmain : null}
    >
      <Row gutter={20}>
        <Col lg={12} md={24} data-testid="leftContent">
          <LeftContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
        <Col
          lg={12}
          className={`md:w-full z-0 ${
            isUserAuthenticated
              ? "relative before:content-[''] before:w-full before:h-full before:absolute before:block before:bg-[url('/images/middle-vector.svg')] before:bg-no-repeat before:bottom-[-25px] before:left-[-200px] 1xl:before:left-[-300px] lg:before:left-auto lg:before:right-[-30px] lg:before:bg-right lg:before:bg-[length:200px_200px] lg:before:bottom-[-65px] md:before:w-[200px] "
              : ""
          }`}
          data-testid="rightContent"
        >
          <RightContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
      </Row>
    </Layout>
  );
};

export default WelcomeContent;
