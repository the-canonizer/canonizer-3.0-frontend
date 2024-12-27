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
      <Row gutter={15} id="hot-topics-heading-row">
        <Col md={12} sm={12} xs={12} id="hot-topics-heading-col">
          <SectionHeading
            title="Hot Topics"
            infoContent="Hot Topics are the most viewed subjects on Canonizer within the past month. These topics have garnered significant attention from users, making them central points of discussion and debate. Join the conversation and see what others are saying!"
          />
        </Col>
      </Row>

      <Row className="mt-4" gutter={[24, 24]} id="hot-topics-list-row">
        {topicData?.map((ft) => (
          <Col
            md={12}
            lg={12}
            xs={24}
            sm={24}
            key={ft?.id}
            id={`hot-topic-col-${ft?.id}`}
          >
            {loadMoreIndicator ? (
              <CustomSkelton
                skeltonFor="hotTopic"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id={`hot-topic-skeleton-${ft?.id}`}
              />
            ) : (
              <SingleTopicCard
                topic={ft}
                onTopicLinkClick={() => setLoadMoreIndicator(false)}
                avatars={ft?.supporterData?.slice(0, 5)}
              />
            )}
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default HotTopics;
