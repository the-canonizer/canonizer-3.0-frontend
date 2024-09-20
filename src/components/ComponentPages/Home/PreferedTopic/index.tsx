import { Fragment, useState } from "react";
import { Row, Col, Typography, Divider } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import SingleTopicCard from "../HotTopics/topicCard";
import CustomSkelton from "components/common/customSkelton";

const { Title } = Typography;

const PreferedTopics = ({ isPage = false }) => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.preferedTopic,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  if (!topicData?.length) {
    return null;
  }

  const topicList = !isPage ? topicData?.slice(0, 6) : topicData;

  return (
    <Fragment>
      {isPage ? (
        <div className="browse-wrapper pb-4 mt-3">
          <Title level={4} className="browse-title !mb-0">
            Your preferred Topics
          </Title>
          <Divider />
        </div>
      ) : (
        <Row gutter={15}>
          <Col md={12} sm={12} xs={12}>
            <SectionHeading
              title="Your preferred topics"
              infoContent="Preferred Topics are a personalized list of subjects shown to you based on the topic tags or categories you selected during registration. These topics align with your interests, making it easier for you to engage in discussions that matter most to you"
            />
          </Col>
          <Col md={12} sm={12} xs={12} className="text-right">
            <SeeMoreLInk href="/preferred-topics" />
          </Col>
        </Row>
      )}

      <div className="mt-3">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topicList?.map((ft) => (
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
                  onTopicLinkClick={() => setLoadMoreIndicator(false)}
                  avatars={ft?.supporterData?.slice(0, 3)}
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
