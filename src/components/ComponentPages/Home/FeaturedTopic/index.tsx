import { Fragment } from "react";
import { Popover, Typography, Row, Col, Image } from "antd";
import {
  InfoCircleOutlined,
  ShareAltOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import AvatarGroup from "src/components/shared/AvaratGroup";
import ViewCounts from "src/components/shared/ViewsCount";
import NameSpaceLabel from "src/components/shared/NameSpaceLabel";
import CardDescription from "../HotTopics/descriptions";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const FeaturedTopic = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.featuredTopic,
  }));

  const settings = {
    autoplay: false,
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "featuresSlider",
    dotsClass: "featuredDots my-[20px] justify-center",
  };

  if (!topicData?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} className="mb-3">
          <Headings level={5} className="text-14 font-bold uppercase mb-0">
            FEATURED TOPICS{" "}
            <Popover content="FEATURED TOPICS" placement="top" className="">
              <InfoCircleOutlined />
            </Popover>
          </Headings>
        </Col>
      </Row>
      <div className="">
        <Slider {...settings}>
          {topicData?.map((ft) => (
            <CommonCard
              className="hover:*:bg-gr hover:*:shadow-none lg:w-full"
              key={ft?.id}
            >
              <Row gutter={20} className="w-full">
                <Col lg={10} md={24} xs={24}>
                  <Image
                    className="w-full rounded-lg h-auto object-cover "
                    preview={false}
                    height={250}
                    width={"100%"}
                    src={ft?.file_full_path}
                  />
                </Col>
                <Col lg={14} md={24} className="flex flex-col lg:mt-3">
                  <div className="flex justify-between pb-2 align-center">
                    <Typography.Paragraph className="m-0 text-medium font-bold font-inter">
                      {ft?.title}
                    </Typography.Paragraph>
                    <div className="">
                      <Popover content="Share Topic" placement="top">
                        <PrimaryButton className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent">
                          <ShareAltOutlined className="text-black p-1 text-medium" />
                        </PrimaryButton>
                      </Popover>
                      <PrimaryButton className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent ml-3">
                        <MoreOutlined className="text-black p-1 text-medium font-bold" />
                      </PrimaryButton>
                    </div>
                  </div>
                  <CardDescription description={ft?.description} />
                  <div className="flex justify-between pt-3 mt-auto lg:flex-col">
                    <div className="text-left flex lg:flex-col sm:flex-col">
                      <NameSpaceLabel namespace={ft?.namespace} />
                      <ViewCounts views={ft?.views} />
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
