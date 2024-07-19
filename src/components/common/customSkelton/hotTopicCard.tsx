import { Card } from "antd";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";

import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

const HotTopicCard = ({ stylingClass, cardStylingClass = "" }) => {
  return (
    <Card
      className={`${styles.cardSkeleton} bg-canGray w-100 ${styles[cardStylingClass]} border-0`}
    >
      <Skeleton className={styles[stylingClass]} />
      <Skeleton className={styles[stylingClass]} />
      <div className="flex justify-between pt-3 mt-auto">
        <div className="flex justify-between w-full">
          <div className="mr-auto w-[20px]">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="ml-auto">
            <SkeletonAvatar />
            <SkeletonAvatar />
            <SkeletonAvatar />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HotTopicCard;
