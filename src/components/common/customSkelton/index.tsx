import { Avatar, Card, Switch } from "antd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

const { Meta } = Card;

const CustomSkelton = ({ skeltonFor, bodyCount, stylingClass, isButton }) => {
  return skeltonFor == "card" ? (
    <Card
      className={styles.cardSkeleton}
      actions={[
        <div className={styles.cardSkeleton_actions}>
          <Skeleton
            className={styles.cardSkeleton_actions_button}
            count={1}
          />
        </div>,
      ]}
      title=<Skeleton height={29} className={styles[stylingClass]} style={{margin: '2px 0'}} count={1} />
    >
      <Skeleton className={styles[stylingClass]} count={bodyCount} />
    </Card>
  ) : skeltonFor == "list" ? (
      <Skeleton className={styles.listSkeleton} count={bodyCount} />
  ) : null;
};

export default CustomSkelton;
