import { Card } from "antd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

import PostCustomSkelton from "./postCard";
import SubscriptionCustomSkelton from "./subscriptionCard";

const CustomSkelton = ({
  skeltonFor,
  bodyCount,
  stylingClass,
  listStyle = "blank",
  isButton,
}) => {
  return skeltonFor == "card" ? (
    <Card
      className={styles.cardSkeleton}
      actions={[
        <div className={styles.cardSkeleton_actions}>
          <Skeleton className={styles.cardSkeleton_actions_button} count={1} />
        </div>,
      ]}
      title={
        <Skeleton
          height={29}
          className={styles[stylingClass]}
          style={{ margin: "2px 0" }}
          count={1}
        />
      }
    >
      <Skeleton className={styles[stylingClass]} count={bodyCount} />
    </Card>
  ) : skeltonFor == "list" ? (
    <Skeleton
      className={`${styles.listSkeleton} ${styles[listStyle]}`}
      count={bodyCount}
    />
  ) : skeltonFor == "tree" ? (
    <ul className={styles.treeSkeleton}>
      <li>
        <Skeleton />
        <ul>
          <li>
            <Skeleton />
            <ul>
              <li>
                <Skeleton />
                <ul>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <Skeleton />
          </li>
        </ul>
      </li>
      <li>
        <Skeleton />
        <ul>
          <li>
            <Skeleton />
          </li>
          <li>
            <Skeleton />
          </li>
          <li>
            <Skeleton />
          </li>
        </ul>
      </li>
    </ul>
  ) : skeltonFor == "post_card" ? (
    <PostCustomSkelton bodyCount={bodyCount} stylingClass={stylingClass} />
  ) : skeltonFor == "subscription_card" ? (
    <SubscriptionCustomSkelton stylingClass={stylingClass} />
  ) : null;
};

export default CustomSkelton;
