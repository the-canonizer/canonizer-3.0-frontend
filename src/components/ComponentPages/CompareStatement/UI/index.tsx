import { Fragment } from "react";
import { useRouter } from "next/router";
import { Typography, Button, Row, Col, Spin, Card, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "./index.module.scss";

import CreateCampBtn from "../../../common/button/createNewCampBtn";
import CreateTopicBtn from "../../../common/button/createNewTopicBtn";

const { Title, Text, Paragraph } = Typography;

function CompareStatementUI({ campStatementHistory, loadingIndicator }) {
  const router = useRouter();

  return (
    <Fragment>
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <Title level={5}>
            <Text>Topic :</Text>{" "}
            {campStatementHistory?.length &&
              campStatementHistory[0].topic?.topic_name}
          </Title>
          <Title level={5}>
            <Text>Camp : </Text>{" "}
            <Text className={styles.blueText}>
              {campStatementHistory?.length &&
                campStatementHistory[0]?.parentCamp?.map((camp, index) => {
                  return (
                    <Link
                      href={`/topic/${router.query.routes[0]}/${
                        camp?.camp_num
                      }-${camp?.camp_name?.split(" ").join("-")}`}
                      key={camp?.camp_num}
                    >
                      <a>
                        {index !== 0 && "/"}
                        {`${camp?.camp_name}`}
                      </a>
                    </Link>
                  );
                })}
            </Text>
          </Title>
        </div>
        <div className={styles.btnGroup}>
          <CreateTopicBtn />
          <CreateCampBtn
            url={`/camp/create/${
              router.query.routes[0] + "/" + router.query.routes[1]
            }`}
          />
        </div>
        <div className={styles.campStatement}>
          <div className={styles.tabHead}>
            <div className={styles.filterOt}>
              <Button className={styles.active} type="primary">
                <ArrowLeftOutlined />
              </Button>
              <Title level={4}>Camp Statement History Comparison</Title>
            </div>
          </div>
          <div className={styles.contentBody}>
            <Spin spinning={loadingIndicator} size="large">
              <Row gutter={50}>
                <Col span={12}>
                  <Card
                    bordered
                    className={styles.compareCard + " " + styles.old}
                  >
                    <Paragraph>
                      <Text strong>Edit Summary:</Text> Update
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on:</Text> 5/26
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name:</Text> ali ahmad
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time:</Text> 5/27
                    </Paragraph>
                    <Text strong>Line 48:</Text>
                    <Card bordered className={styles.compareCardInternal}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: "<p>lorem ipsum</p>",
                        }}
                      ></div>
                    </Card>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    bordered
                    className={styles.compareCard + " " + styles.old}
                  >
                    <Paragraph>
                      <Text strong>Edit Summary:</Text> Update
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on:</Text> 5/26
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name:</Text> ali ahmad
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time:</Text> 5/27
                    </Paragraph>
                    <Text strong>Line 48:</Text>
                    <Card bordered className={styles.compareCardInternal}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: "<p>lorem ipsum</p>",
                        }}
                      ></div>
                    </Card>
                  </Card>
                </Col>
                <Col span={24}>
                  <Divider />
                  <Card
                    bordered={false}
                    className={styles.latestCard}
                    title={
                      <Text>Latest revision as of 12:16, 10 November 2021</Text>
                    }
                  >
                    <Text strong>Statement:</Text>
                    <div
                      dangerouslySetInnerHTML={{ __html: "<h1>Hello</h1>" }}
                    ></div>
                    <Divider />
                    <Paragraph>
                      <Text strong>Edit Summary:</Text> Update
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on:</Text> 5/26
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name:</Text> ali ahmad
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time:</Text> 5/27
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Spin>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CompareStatementUI;
