import { Fragment, useState } from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SingleVideoCard from "./videoCard";
import CustomSkelton from "components/common/customSkelton";

const ConsensusVideoPodcasts = () => {
  const { consensusVideoPodcasts } = useSelector((state: RootState) => ({
    consensusVideoPodcasts: state?.hotTopic?.consensusVideoPodcasts,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  if (!consensusVideoPodcasts?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15} id="podcast-video-heading-row">
        <Col md={12} sm={12} xs={12} id="podcast-video-heading-col">
          <SectionHeading
            title="Consensus Video Podcasts"
            infoContent="Consensus Video Podcasts are the podcast videos from the youtube canonizer podcast channel"
          />
        </Col>
      </Row>

      <Row className="mt-4" gutter={[24, 24]} id="podcast-video-list-row">
        {consensusVideoPodcasts?.map((ft) => (
          <Col
            md={12}
            lg={12}
            xs={24}
            sm={24}
            key={ft?.id}
            id={`podcast-video-col-${ft?.id}`}
          >
            {loadMoreIndicator ? (
              <CustomSkelton
                skeltonFor="PodcastVideos"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id={`podcast-video-skeleton-${ft?.id}`}
              />
            ) : (
              <SingleVideoCard
                video={ft}
                onVideoLinkClick={() => setLoadMoreIndicator(false)}
                descriptionTextLength={320}
              />
            )}
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default ConsensusVideoPodcasts;
