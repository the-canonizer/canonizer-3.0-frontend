import { Fragment, useEffect, useState } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SingleTopicCard from "./topicCard";
import CustomSkelton from "components/common/customSkelton";
import { GetHotTopicDetails } from "src/network/api/topicAPI";

const HotTopics = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  const [hotTopics, setHotTopics] = useState([]);

  useEffect(() => {
    setHotTopics(topicData);
  }, [topicData]);

  useEffect(() => {
    const getHotTopics = async () => {
      setLoadMoreIndicator(true);
      await GetHotTopicDetails(1, 6);
      setLoadMoreIndicator(false);
    };

    getHotTopics();
  }, []);

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="Hot Topics"
            infoContent="Hot Topics are the most viewed subjects on Canonizer within the past month. These topics have garnered significant attention from users, making them central points of discussion and debate. Join the conversation and see what others are saying!"
          />
        </Col>
      </Row>

      <Row className="mt-4" gutter={[24, 24]}>
        {hotTopics?.map((ft) => (
          <Col md={12} lg={8} xs={24} sm={24} key={ft?.id}>
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
                avatars={ft?.supporterData?.slice(0, 3)}
              />
            )}
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default HotTopics;
