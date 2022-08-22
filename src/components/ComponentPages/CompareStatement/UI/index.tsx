import { Fragment } from "react";
import { useRouter } from "next/router";
import { Typography, Button, Row, Col, Spin, Card, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import styles from "./index.module.scss";

import CreateCampBtn from "../../../common/button/createNewCampBtn";
import CreateTopicBtn from "../../../common/button/createNewTopicBtn";
import CampInfoBar from "../../TopicDetails/CampInfoBar";

const { Title, Text, Paragraph } = Typography;

function CompareStatementUI({ statements, isLoading, liveStatement }) {
  const router = useRouter();
  const s1 = statements[0] || {},
    s2 = statements[1] || {};

  let payload = {
    camp_num: router?.query?.routes[1]?.split("-")[0],
    topic_num: router?.query?.routes[0]?.split("-")[0],
    topic_name: router?.query?.routes[0].split("-").slice(1).join(" "),
  };

  const getBackUrl = () => {
    const query = router?.query;
    if (query.from === "topic") {
      router.push({
        pathname: `/topic/history/${router?.query?.routes[0]}}`,
      });
    } else {
      router.push({
        pathname: `/statement/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    }
  };

  return (
    <Fragment>
      <div className={styles.wrap}>
        <CampInfoBar payload={payload} />
        <div className={styles.btnGroup}>
          <CreateTopicBtn />
          <CreateCampBtn
            url={`/camp/create/${
              router?.query?.routes[0] + "/" + router?.query?.routes[1]
            }`}
          />
        </div>
        <div className={styles.campStatement}>
          <div className={styles.tabHead}>
            <div className={styles.filterOt}>
              <Button
                className={styles.active}
                type="primary"
                onClick={getBackUrl}
              >
                <ArrowLeftOutlined />
              </Button>
              <Title level={4}>Camp Statement History Comparison</Title>
            </div>
          </div>
          <div className={styles.contentBody}>
            <Spin spinning={isLoading} size="large">
              <Row gutter={50}>
                <Col span={12}>
                  <Card
                    bordered
                    className={
                      styles.compareCard + " " + styles[s1?.status || "old"]
                    }
                  >
                    <Paragraph>
                      <Text strong>Edit Summary : </Text>
                      <Text>{s1?.note}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on : </Text>
                      <Text>{s1?.submit_time}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            s1["submitter_nick_id"] || ""
                          }?topicnum=${s1["topic_num"] || ""}&campnum=${
                            s1["camp_num"] || ""
                          }&namespace=${liveStatement["namespace_id"] || 1}`}
                        >
                          <a>{s1?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>{s1?.go_live_time}</Text>
                    </Paragraph>
                    <Text strong>Statement : </Text>
                    <Card
                      bordered
                      className={
                        styles.compareCardInternal + " " + styles.inter1
                      }
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: s1?.parsed_v }}
                      ></div>
                    </Card>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    bordered
                    className={
                      styles.compareCard + " " + styles[s2?.status || "old"]
                    }
                  >
                    <Paragraph>
                      <Text strong>Edit Summary : </Text>
                      <Text>{s2?.note}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on : </Text>
                      <Text>{s2?.submit_time}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            s2["submitter_nick_id"] || ""
                          }?topicnum=${s2["topic_num"] || ""}&campnum=${
                            s2["camp_num"] || ""
                          }&namespace=${liveStatement["namespace_id"] || 1}`}
                        >
                          <a>{s2?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>{s2?.go_live_time}</Text>
                    </Paragraph>
                    <Text strong>Statement : </Text>
                    <Card
                      bordered
                      className={
                        styles.compareCardInternal + " " + styles.inter2
                      }
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: s2?.parsed_v }}
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
                      <Text>
                        Latest revision as of
                        {moment(liveStatement?.revision_date).format(
                          " hh:mm, DD MMMM YYYY"
                        )}
                      </Text>
                    }
                  >
                    <Text strong>Statement : </Text>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: liveStatement?.parsed_value,
                      }}
                    ></div>
                    <Divider />
                    <Paragraph>
                      <Text strong>Edit Summary : </Text>
                      <Text>{liveStatement?.note}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on : </Text>
                      <Text>{liveStatement?.submit_time}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nick Name : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            liveStatement["submitter_nick_id"] || ""
                          }?topicnum=${
                            liveStatement["topic_num"] || ""
                          }&campnum=${
                            liveStatement["camp_num"] || ""
                          }&namespace=${liveStatement["namespace_id"] || 1}`}
                        >
                          <a>{liveStatement?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>{liveStatement?.go_live_time}</Text>
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
