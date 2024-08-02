import { Fragment, useState } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SingleTopicCard from "./topicCard";
import CustomSkelton from "components/common/customSkelton";

const HotTopics = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading title="Hot Topics" infoContent="Hot Topics" />
        </Col>
      </Row>

      <Row className="mt-4" gutter={[24, 24]}>
        {topicData?.map((ft) => (
          <Col md={12} lg={8} xs={24} sm={24} key={ft?.id}>
            {console.log("ft----", ft)}
            {loadMoreIndicator ? (
              <CustomSkelton
                skeltonFor="hotTopic"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <SingleTopicCard
                topic={ft}
                onTopicLinkClick={() => setLoadMoreIndicator(false)}
              />
            )}
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default HotTopics;
