import { Card, Tag, Button, Tooltip, Typography, Empty } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import Link from "next/link";

import styles from "./SubscriptionsList.module.scss";

const { Title } = Typography;

function TopicSubscriptionsTab({
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
}) {
  return subscriptionsList.length ? (
    subscriptionsList.map((data, i) => {
      return (
        <Card
          key={i}
          className={`${styles.cardBox_tags} ${
            data.camps?.length > 0 ? "" : styles.no_body
          }`}
          type="inner"
          size="default"
          title={
            <Title level={5} className={styles.card_heading_title}>
              For Topic{" "}
              <span>
                &quot;
                <Link href={data.title_link}>{data.title}</Link>
                &quot;
              </span>
            </Title>
          }
          extra={
            data.is_remove_subscription ? (
              <Tooltip title="Remove subscription">
                <Button
                  className={styles.cardTitle}
                  onClick={(e) => onRemoveSubscription(e, data)}
                  type="link"
                  danger
                  icon={<CloseCircleOutlined />}
                >
                  Remove subscription
                </Button>
              </Tooltip>
            ) : null
          }
          style={{ width: "100%", marginBottom: 16 }}
        >
          {data.camps?.map((camp, i) => {
            return (
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
                  <Link href={camp.camp_link} className={styles.Bluecolor}>
                    {" "}
                    {camp.camp_name}
                  </Link>
                </div>
              </Tag>
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
