import { Fragment } from "react";
import { Typography, Row, Col, Image } from "antd";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import { isServer } from "src/utils/generalUtility";
import CommonCard from "src/components/shared/Card";
import AvatarGroup from "src/components/shared/AvaratGroup";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import CardDescription from "../HotTopics/descriptions";
import SectionHeading from "./sectionsHeading";
import SocialShare from "components/shared/ShareTopic";
import TopicOptions from "components/shared/TopicOptions";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const FeaturedTopic = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.featuredTopic,
  }));

  const settings = {
    autoplay: false,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "16px",
    className: "featuresSlider",
    dotsClass: "featuredDots my-[20px] justify-center",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          // slidesToShow: 1,
          // slidesToScroll: 1,
          // centerMode: true,
          // infinite: false,
          // centerPadding: "20px",
        },
      },
    ],
  };

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <SectionHeading title="FEATURED TOPICS" infoContent="FEATURED TOPICS" />
      <div className="mt-4]">
        <Slider {...settings}>
          {topicData?.map((ft) => (
            <CommonCard
              className="bg-canGray w-full p-0 [&>.ant-card-body]:p-0 xl:[&>.ant-card-body]:py-5 xl:[&>.ant-card-body]:px-8"
              key={ft?.id}
            >
              <Row gutter={0} className="w-full min-w-full max-w-full relative">
                <Col
                  xl={8}
                  lg={24}
                  md={24}
                  xs={24}
                  className="before:content-[''] before:bg-custom-gradient relative before:absolute before:w-full before:h-full z-0 before:z-10 lg:before:hidden"
                >
                  <Image
                    className="w-full rounded-lg h-auto object-cover h-full min-h-28 md:min-h-60 max-h-48 md:max-h-72"
                    preview={false}
                    height={"100%"}
                    width={"100%"}
                    src={ft?.file_full_path}
                    rootClassName="h-full"
                  />
                </Col>
                <Col
                  xl={16}
                  lg={24}
                  md={24}
                  xs={24}
                  className="flex flex-col mt-3 xl:mt-0 md:pl-4 px-3 pb-5 xl:px-7 xl:pb-0 static xl:!pr-0"
                >
                  <div className="flex justify-between pb-4 align-center z-100 relative -ml-4 -mr-4 lg:ml-0 lg:mr-0">
                    <Typography.Paragraph className="m-0 text-base lg:text-xl font-medium lg:font-bold font-inter absolute -top-14 left-1 right-0 text-white px-3 py-0 !mb-0 flex w-full lg:static lg:px-0 lg:py-0 lg:text-canBlack">
                      {ft?.title}
                    </Typography.Paragraph>
                    <div className="hidden lg:flex items-start justify-center">
                      <SocialShare
                        key={ft?.id}
                        campName={ft?.camp_name}
                        campUrl={!isServer() && window?.location?.href}
                      />
                      <TopicOptions eventLineHref={""} />
                    </div>
                  </div>
                  <CardDescription description={ft?.description} />
                  <div className="flex justify-between pt-3 mt-auto">
                    <div className="text-left flex flex-col sm:flex-row">
                      <NameSpaceLabel namespace={ft?.namespace} />
                      <div className="absolute top-2 right-2 px-2 rounded-md bg-canBlack lg:static lg:bg-transparent lg:px-0 lg:flex">
                        <ViewCounts views={ft?.views} />
                      </div>
                    </div>
                    <AvatarGroup
                      avatars={ft?.supporterData}
                      size="large"
                      maxStyle={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </CommonCard>
          ))}
        </Slider>
      </div>
    </Fragment>
  );
};

export default FeaturedTopic;
