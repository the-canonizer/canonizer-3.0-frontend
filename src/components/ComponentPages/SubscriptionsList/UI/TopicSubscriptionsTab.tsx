import {
  Card,
  Tag,
  Button,
  Tooltip,
  Typography,
  Empty,
  Pagination,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import Link from "next/link";

import styles from "./SubscriptionsList.module.scss";
import { useState, useEffect } from "react";

const { Title } = Typography;

function TopicSubscriptionsTab({
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
}: any) {
  const [subList, setSubList] = useState([]);
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    pageChange(1, 5);
    setCurrent(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionsList]);
  const pageChange = (pageNumber, pageSize) => {
    setCurrent(pageNumber);
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setSubList(subscriptionsList.slice(startingPosition, endingPosition));
  };
  return subscriptionsList.length ? (
    <div key="subscription_cart">
      {subList.length > 0 &&
        subList.map((data) => {
          return (
            <Card
              key={data?.topic_num}
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
                    <Link href={data.title_link}>
                      <a>{data.title}</a>
                    </Link>
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
                      data-testid="camp-remove"
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
                      <Link href={camp.camp_link}>
                        <a className={styles.Bluecolor}> {camp.camp_name}</a>
                      </Link>
                    </div>
                  </Tag>
                );
              })}
            </Card>
          );
        })}
      {subscriptionsList &&
        subscriptionsList.length > 0 &&
        subList.length > 0 && (
          <Pagination
            hideOnSinglePage={true}
            current={current}
            total={subscriptionsList.length}
            pageSize={5}
            onChange={pageChange}
            showSizeChanger={false}
          />
        )}
    </div>
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
