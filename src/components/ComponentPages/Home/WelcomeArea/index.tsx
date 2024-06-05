import { Col, Layout, Row } from "antd";

import LeftContent from "./leftContent";
import RightContent from "./rightContent";
import useAuthentication from "src/hooks/isUserAuthenticated";

const WelcomeContent = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Layout className="bg-gr rounded-lg p-4">
      <Row gutter={20}>
        <Col span={12}>
          <LeftContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
        <Col span={12}>
          <RightContent isUserAuthenticated={isUserAuthenticated} />
        </Col>
      </Row>
    </Layout>
  );
};

export default WelcomeContent;
