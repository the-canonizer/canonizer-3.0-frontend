import { Card, Tag, Tooltip, Typography, Empty, Row, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import Link from "next/link";

import styles from "../../SubscriptionsList/UI/SubscriptionsList.module.scss";

const { Title, Text } = Typography;

function TopicSubscriptionsTab({ subscriptionsList, onConfirm }) {
  return subscriptionsList.length ? (
    subscriptionsList.map((data, i) => {
      return (
        <Card
          key={i}
          className={`${styles.cardBox_tags} ${
            data.camps?.length > 0 ? "" : styles.no_body
          }`}
          data-testid="cards"
          type="inner"
          size="default"
          title={
            <Title level={5} className={styles.card_heading_title}>
              For Topic{" "}
              <span>
                &quot;
                <Link href={data.title_link}>
                  <a>{data.title}</a>
                </Link>
                &quot;
              </span>
            </Title>
          }
          style={{ width: "100%", marginBottom: 16 }}
        >
          {data.camps?.map((camp, i) => {
            return (
              <Row gutter={30}>
                <Col md={12}>
                  <Tag
                    key={camp.subscription_start + i}
                    className={styles.tag_btn}
                    closable
                    onClose={(e) => onConfirm(e, data, camp)}
                    closeIcon={
                      <Tooltip title="Remove camp subscription">
                        <CloseCircleOutlined />
                      </Tooltip>
                    }
                  >
                    <div>
                      <span className={styles.count}>{i + 1}. </span>
                      <Link href={camp.camp_link}>
                        <a className={styles.Bluecolor}> {camp.camp_name}</a>
                      </Link>
                    </div>
                  </Tag>
                </Col>
                <Col md={12}>
                  <Text className={styles.reasonList}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Vero, placeat.
                  </Text>
                  <br />
                  <Text className={`${styles.reasonLink} ${styles.Bluecolor}`}>
                    <Link href={""} passHref target="_blank">
                      <a>Reference Link</a>
                    </Link>
                  </Text>
                </Col>
              </Row>
            );
          })}
        </Card>
      );
    })
  ) : (
    <Card
      className={styles.cardBox_tags}
      type="inner"
      size="default"
      style={{ width: "100%" }}
    >
      <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
    </Card>
  );
}

export default TopicSubscriptionsTab;
