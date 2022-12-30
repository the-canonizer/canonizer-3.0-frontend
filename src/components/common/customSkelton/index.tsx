import { Avatar, Card, Switch } from "antd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

const { Meta } = Card;

const CustomSkelton = ({ skeltonFor, bodyCount, stylingClass, isButton }) => {
  return skeltonFor == "card" ? (
    <Card
      actions={[
        <div style={{ textAlign: "right" }}>
          {" "}
          <Skeleton
            style={{ height: "38px", width: "230px", marginRight: "1rem" }}
            className={styles[stylingClass]}
            count={1}
          />
        </div>,
      ]}
      title=<Skeleton height={28} className={styles[stylingClass]} count={1} />
    >
      <Skeleton className={styles[stylingClass]} count={bodyCount} />
    </Card>
  ) : null;
};

export default CustomSkelton;
