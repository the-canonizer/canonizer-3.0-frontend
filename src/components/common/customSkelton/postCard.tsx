import { Card, Typography } from "antd";
import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

const PostCustomSkelton = ({ bodyCount, stylingClass }: any) => {
  return (
    <Card
      className={`${styles.cardSkeleton} ${styles.postCard}`}
      bodyStyle={{ padding: "15px" }}
    >
      <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
        <Typography.Text>
          <Skeleton
            height={30}
            className={styles[stylingClass]}
            style={{ margin: "0 0" }}
            count={1}
          />
        </Typography.Text>
      </div>
      <Skeleton
        height={200}
        className={styles[stylingClass]}
        count={bodyCount}
      />
    </Card>
  );
};

export default PostCustomSkelton;
