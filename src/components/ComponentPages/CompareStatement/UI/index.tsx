import { Fragment } from "react";
import { useRouter } from "next/router";
import { Typography, Button, Row, Col, Card, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import styles from "./index.module.scss";

import CampInfoBar from "../../TopicDetails/CampInfoBar";
import CustomSkelton from "../../../common/customSkelton";
import { changeSlashToArrow } from "src/utils/generalUtility";

const { Title, Text, Paragraph } = Typography;

const validUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

function CompareStatementUI({
  statements,
  isLoading,
  liveStatement,
  itemsStatus,
}: any) {
  const router = useRouter();
  const s1 = statements?.at(0) || {},
    s2 = statements?.at(1) || {},
    from = router?.query?.from;

  let payload = {
    camp_num: router?.query?.routes[1]?.split("-")[0] ?? "1",
    topic_num: router?.query?.routes[0]?.split("-")[0],
  };

  const getBackUrl = () => {
    const query = router?.query;
    if (query.from === "topic") {
      router?.push({
        pathname: `/topic/history/${router?.query?.routes[0]}}`,
      });
    } else if (query.from === "statement") {
      router?.push({
        pathname: `/statement/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    } else {
      router?.push({
        pathname: `/camp/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    }
  };

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  return (
    <Fragment>
      <div className={styles.wrap}>
        <CampInfoBar payload={payload} />
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
              <Title level={4}>
                {from === "topic"
                  ? "Topic "
                  : from === "camp"
                  ? "Camp "
                  : "Camp Statement "}
                History Comparison
              </Title>
            </div>
          </div>
          <div className={styles.contentBody}>
            <Row gutter={[50, 15]}>
              <Col xs={24} md={12}>
                {isLoading ? (
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={5}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                  />
                ) : (
                  <Card
                    bordered
                    className={
                      styles.compareCard +
                      " " +
                      styles[itemsStatus[s1?.id] || "old"]
                    }
                  >
                    <Paragraph>
                      <Text strong>Edit Summary : </Text>
                      <Text>{s1?.note}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on : </Text>
                      <Text>
                        {s1?.submit_time ? covertToTime(s1?.submit_time) : ""}
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nickname : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            s1["submitter_nick_id"] || ""
                          }?canon=${s1["namespace_id"] || 1}`}
                        >
                          <a>{s1?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>
                        {s1?.go_live_time ? covertToTime(s1?.go_live_time) : ""}
                      </Text>
                    </Paragraph>
                    {from == "topic" ? (
                      <Paragraph>
                        <Text strong>Canon : </Text>
                        <Text>{changeSlashToArrow(s1?.namespace)}</Text>
                      </Paragraph>
                    ) : null}
                    {from == "camp" ? (
                      <Fragment>
                        {s1?.camp_num != 1 ? (
                          <Paragraph>
                            <Text strong>Parent Camp : </Text>
                            <Text>{s1?.parent_camp_name}</Text>
                          </Paragraph>
                        ) : (
                          ""
                        )}

                        <Paragraph>
                          <Text strong>Keywords : </Text>
                          <Text>{s1?.key_words}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About URL : </Text>
                          <Text>
                            {validUrl(s1?.camp_about_url) ? (
                              <Link href={s1?.camp_about_url || ""}>
                                <a>{s1?.camp_about_url}</a>
                              </Link>
                            ) : null}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About Nickname : </Text>
                          <Text>
                            <Link
                              href={`/user/supports/${
                                s1["camp_about_nick_id"] || ""
                              }?canon=${s1["namespace_id"] || 1}`}
                            >
                              <a>{s1?.camp_about_nick_name}</a>
                            </Link>
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Disable Additional Sub Camps : </Text>
                          <Text>{s1?.is_disabled == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Single Level Camps Only : </Text>
                          <Text>{s1?.is_one_level == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp Archived : </Text>
                          <Text>{s1?.is_archive == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                      </Fragment>
                    ) : null}
                    <Text strong style={{ textTransform: "capitalize" }}>
                      {from === "topic"
                        ? "Topic Name"
                        : from === "camp"
                        ? "Camp Name"
                        : from}{" "}
                      :{" "}
                    </Text>
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
                )}
              </Col>
              <Col xs={24} md={12}>
                {isLoading ? (
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={5}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                  />
                ) : (
                  <Card
                    bordered
                    className={
                      styles.compareCard +
                      " " +
                      styles[itemsStatus[s2?.id] || "old"]
                    }
                  >
                    <Paragraph>
                      <Text strong>Edit Summary : </Text>
                      <Text>{s2?.note}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitted on : </Text>
                      <Text>
                        {s2?.submit_time ? covertToTime(s2?.submit_time) : ""}
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nickname : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            s2["submitter_nick_id"] || ""
                          }?canon=${s2["namespace_id"] || 1}`}
                        >
                          <a>{s2?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>
                        {s2?.go_live_time ? covertToTime(s2?.go_live_time) : ""}
                      </Text>
                    </Paragraph>
                    {from == "topic" ? (
                      <Paragraph>
                        <Text strong>Canon : </Text>
                        <Text>{changeSlashToArrow(s2?.namespace)}</Text>
                      </Paragraph>
                    ) : null}
                    {from == "camp" ? (
                      <Fragment>
                        {s2?.camp_num != 1 ? (
                          <Paragraph>
                            <Text strong>Parent Camp : </Text>
                            <Text>{s2?.parent_camp_name}</Text>
                          </Paragraph>
                        ) : (
                          ""
                        )}
                        <Paragraph>
                          <Text strong>Keywords : </Text>
                          <Text>{s2?.key_words}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About URL : </Text>
                          <Text>
                            {validUrl(s2?.camp_about_url) ? (
                              <Link href={s2?.camp_about_url || ""}>
                                <a>{s2?.camp_about_url}</a>
                              </Link>
                            ) : null}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About Nickname : </Text>
                          <Text>
                            <Link
                              href={`/user/supports/${
                                s2["camp_about_nick_id"] || ""
                              }?canon=${s2["namespace_id"] || 1}`}
                            >
                              <a>{s2?.camp_about_nick_name}</a>
                            </Link>
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Disable Additional Sub Camps : </Text>
                          <Text>{s2?.is_disabled == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Single Level Camps Only : </Text>
                          <Text>{s2?.is_one_level == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp Archived : </Text>
                          <Text>{s2?.is_archive == 1 ? "Yes" : "No"}</Text>
                        </Paragraph>
                      </Fragment>
                    ) : null}
                    <Text strong style={{ textTransform: "capitalize" }}>
                      {from === "topic"
                        ? "Topic Name"
                        : from === "camp"
                        ? "Camp Name"
                        : from}{" "}
                      :{" "}
                    </Text>
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
                )}
              </Col>
              <Col span={24}>
                <Divider />
                {isLoading ? (
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={5}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                    bordered={false}
                    cardStylingClass="fullSkeleton"
                  />
                ) : liveStatement ? (
                  <Card
                    bordered={false}
                    className={
                      styles.latestCard + " " + styles[liveStatement?.status] ||
                      "live"
                    }
                    title={
                      <Text>
                        Latest revision as of{" "}
                        {liveStatement?.revision_date
                          ? covertToTime(liveStatement?.revision_date)
                          : ""}
                      </Text>
                    }
                  >
                    <Text strong style={{ textTransform: "capitalize" }}>
                      {from === "topic"
                        ? "Topic Name"
                        : from === "camp"
                        ? "Camp Name"
                        : from}{" "}
                      :{" "}
                    </Text>
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
                      <Text>
                        {liveStatement?.submit_time
                          ? covertToTime(liveStatement?.submit_time)
                          : ""}
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Submitter Nickname : </Text>
                      <Text>
                        <Link
                          href={`/user/supports/${
                            liveStatement["submitter_nick_id"] || ""
                          }?canon=${liveStatement["namespace_id"] || 1}`}
                        >
                          <a>{liveStatement?.submitter_nick_name}</a>
                        </Link>
                      </Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Go live time : </Text>
                      <Text>
                        {liveStatement?.go_live_time
                          ? covertToTime(liveStatement?.go_live_time)
                          : ""}
                      </Text>
                    </Paragraph>
                    {from == "topic" ? (
                      <Paragraph>
                        <Text strong>Canon : </Text>
                        <Text>
                          {changeSlashToArrow(liveStatement?.namespace)}
                        </Text>
                      </Paragraph>
                    ) : null}
                    {from == "camp" ? (
                      <Fragment>
                        {liveStatement?.camp_num != 1 ? (
                          <Paragraph>
                            <Text strong>Parent Camp : </Text>
                            <Text>{liveStatement?.parent_camp_name}</Text>
                          </Paragraph>
                        ) : (
                          ""
                        )}
                        <Paragraph>
                          <Text strong>Keywords : </Text>
                          <Text>{liveStatement?.key_words}</Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About URL : </Text>
                          <Text>
                            {validUrl(liveStatement?.camp_about_url) ? (
                              <Link href={liveStatement?.camp_about_url || ""}>
                                <a>{liveStatement?.camp_about_url}</a>
                              </Link>
                            ) : null}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp About Nickname : </Text>
                          <Text>
                            <Link
                              href={`/user/supports/${
                                liveStatement["camp_about_nick_id"] || ""
                              }?canon=${liveStatement["namespace_id"] || 1}`}
                            >
                              <a>{liveStatement?.camp_about_nick_name}</a>
                            </Link>
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Disable Additional Sub Camps : </Text>
                          <Text>
                            {liveStatement?.is_disabled == 1 ? "Yes" : "No"}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Single Level Camps Only : </Text>
                          <Text>
                            {liveStatement?.is_one_level == 1 ? "Yes" : "No"}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Camp Archived : </Text>
                          <Text>
                            {liveStatement?.is_archive == 1 ? "Yes" : "No"}
                          </Text>
                        </Paragraph>
                      </Fragment>
                    ) : null}
                  </Card>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CompareStatementUI;
