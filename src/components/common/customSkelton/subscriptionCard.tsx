import { Card, Typography, Tag } from "antd";
import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

const { Title } = Typography;

const SubscriptionCustomSkelton = ({ bodyCount, stylingClass }) => {
  const cardArray = [];
  if (bodyCount == null || bodyCount == undefined || bodyCount == "") {
    bodyCount = 1;
  }
  for (let i = 0; i < bodyCount; i++) {
    cardArray.push(
      <Card
        key={"skeleton_card_" + i}
        className={`${styles.cardBox_tags} ${styles.cardSkeleton} ${styles.postCard}`}
        type="inner"
        size="default"
        title={
          <Title level={5} className={styles.card_heading_title}>
            <Skeleton
              height={30}
              className={styles[stylingClass]}
              style={{ margin: "0 0" }}
              count={1}
            />
          </Title>
        }
        extra={
          <Title level={5} className={styles.card_heading_title}>
            <Skeleton
              height={30}
              className={styles[stylingClass]}
              style={{ margin: "0 0" }}
              count={1}
            />
          </Title>
        }
        style={{ width: "100%", marginBottom: 16 }}
      >
        {[1, 2]?.map((camp, i) => {
          return (
            <div className={`${styles.tag_btn}`}>
              <Skeleton
                height={30}
                className={`${styles[stylingClass]} ${styles.tag_btn}`}
                style={{ margin: "0 0" }}
                count={1}
              />
            </div>
          );
        })}
      </Card>
    );
  }
  return <div>{cardArray}</div>;
};

export default SubscriptionCustomSkelton;
