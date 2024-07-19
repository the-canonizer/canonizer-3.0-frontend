import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "./sectionsHeading";
import SingleTopicWithImage from "./topicCardWithImage";
import CustomSkelton from "components/common/customSkelton";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const FeaturedTopic = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.featuredTopic,
  }));

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  const settings = {
    autoplay: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "16px",
    className: "featuresSlider",
    dotsClass: "featuredDots my-[20px] justify-center",
    responsive: [],
  };

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <SectionHeading title="FEATURED TOPICS" infoContent="FEATURED TOPICS" />
      <div className="mt-4">
        {loadMoreIndicator ? (
          <CustomSkelton
            skeltonFor="featuredTopic"
            bodyCount={1}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : (
          <Slider {...settings}>
            {topicData?.map((ft) => (
              <SingleTopicWithImage
                topic={ft}
                key={ft?.id}
                onTopicClick={() => setLoadMoreIndicator(true)}
              />
            ))}
          </Slider>
        )}
      </div>
    </Fragment>
  );
};

export default FeaturedTopic;
