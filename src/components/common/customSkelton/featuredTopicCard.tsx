import { Card, Col, Row } from "antd";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";

import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

const FeaturedTopicCard = ({
  bodyCount,
  stylingClass,
  cardStylingClass = "",
}) => {
  return (
    <Card
      className={`${styles.cardSkeleton} bg-canGray ${styles[cardStylingClass]} border-0`}
    >
      <Row gutter={0} className="w-full min-w-full max-w-full relative">
        <Col
          xl={8}
          lg={24}
          md={24}
          xs={24}
          className="before:content-[''] before:bg-custom-gradient relative before:absolute before:w-full before:h-full z-0 before:z-10 lg:before:hidden"
        >
          <Skeleton className="h-56" count={bodyCount} />
        </Col>
        <Col
          xl={16}
          lg={24}
          md={24}
          xs={24}
          className="flex flex-col mt-3 xl:mt-0 md:pl-4 px-3 pb-5 xl:px-7 xl:pb-0 static xl:!pr-0"
        >
          <Skeleton className={styles[stylingClass]} />
          <Skeleton className={styles[stylingClass]} />
          <div className="flex justify-between pt-3 mt-auto">
            <div className="flex justify-between w-full">
              <div className="mr-auto w-[50px]">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="ml-auto">
                <SkeletonAvatar />
                <SkeletonAvatar />
                <SkeletonAvatar />
                <SkeletonAvatar />
                <SkeletonAvatar />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FeaturedTopicCard;
