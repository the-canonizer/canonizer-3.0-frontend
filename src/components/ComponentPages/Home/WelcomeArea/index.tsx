import { Col, Layout, Row } from "antd";

import LeftContent from "./leftContent";
import RightContent from "./rightContent";
import useAuthentication from "src/hooks/isUserAuthenticated";

const WelcomeContent = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Layout className="bg-gr rounded-lg p-4">
      <Row gutter={20}>
        <Col lg={12}>
          <LeftContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
        <Col lg={12} className="md:w-full">
          <RightContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
      </Row>
    </Layout>
  );
};

export default WelcomeContent;
