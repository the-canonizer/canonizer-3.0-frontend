import { Fragment, useState } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import SingleTopicCard from "../HotTopics/topicCard";
import CustomSkelton from "components/common/customSkelton";

const PreferedTopics = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.preferedTopic,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="Your preferred topics"
            infoContent="Your preferred topics"
          />
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk href="/preferred-topics" />
        </Col>
      </Row>

      <div className="mt-3">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topicData?.slice(0, 6)?.map((ft) => (
            <div className="mb-4 h-full" key={ft?.id}>
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
                  onTopicLinkClick={() => setLoadMoreIndicator(true)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default PreferedTopics;
