import {
  Card,
  Tag,
  Button,
  Tooltip,
  Typography,
  Empty,
  Popconfirm,
} from "antd";
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
          className={styles.cardBox_tags}
          type="inner"
          size="default"
          title={
            <Title level={5} className={styles.card_heading_title}>
              For topic{" "}
              <span>
                &quot;
                <Link href={data.title_link}>
                  <a>{data.title}</a>
                </Link>
                &quot;
              </span>
            </Title>
          }
          extra={
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
          }
          style={{ width: "100%", marginBottom: 16 }}
        >
          {data.camps?.map((camp, i) => {
            return (
              <Tag
                key={i}
                className={styles.tag_btn}
                closable
                onClose={(e) => e.preventDefault()}
                closeIcon={
                  <Popconfirm
                    title="Are you sure？"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={onConfirm}
                  >
                    <CloseCircleOutlined />
                  </Popconfirm>
                }
              >
                <div>
                  <span className={styles.count}>{camp.support_order}. </span>
                  <Link href={camp.camp_link}>
                    <a className={styles.Bluecolor}> {camp.camp_name}</a>
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
