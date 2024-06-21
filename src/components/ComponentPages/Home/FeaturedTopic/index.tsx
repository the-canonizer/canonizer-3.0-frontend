import { Fragment } from "react";
import { Popover, Typography, Row, Col, Image, Avatar, Tooltip } from "antd";
import {
  InfoCircleOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EyeOutlined,
  FlagOutlined,
  UserOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import sanitizeHtml from "sanitize-html";

import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const FeaturedTopic = () => {
  /* eslint-enable */
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  console.log("topicData---", topicData);

  const settings = {
    autoplay: false,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "featuresSlider",
    dotsClass: "featuredDots my-[20px] justify-center",
  };

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
              {console.log("---ft", ft?.file_full_path)}
              <Row gutter={20} className="w-full">
                <Col lg={10} md={24} xs={24}>
                  <Image
                    className="w-full rounded-lg h-auto object-cover "
                    preview={false}
                    height={250}
                    width={"100%"}
                    src={ft?.file_full_path || "/images/dummy-images.png"}
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
                  <div
                    className="text-14 font-inter font-normal mb-3 text-black opacity-80 leading-26 overflow-hidden line-clamp-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(ft?.description, {
                        allowedAttributes: {
                          "*": [
                            "class",
                            "id",
                            "href",
                            "align",
                            "alt",
                            "center",
                            "bgcolor",
                            "src",
                            "title",
                            "style",
                            "rel",
                            "target",
                          ],
                        },
                      }),
                    }}
                  ></div>
                  <div className="flex justify-between pt-3 mt-auto lg:flex-col">
                    <div className="text-left flex lg:flex-col sm:flex-col">
                      <Popover content="Share Topic" placement="top">
                        <Typography.Paragraph className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex items-center leading-1 mb-0 mr-3">
                          <FlagOutlined className="text-black p-1 text-medium" />
                          <Link href="">
                            <a className="text-blue text-14 font-inter font-medium hover:hblue">
                              General
                            </a>
                          </Link>
                        </Typography.Paragraph>
                      </Popover>
                      <Typography.Paragraph className="m-0 text-light font-medium font-inter flex items-center">
                        <EyeOutlined className="text-black p-1 text-medium" />{" "}
                        123
                      </Typography.Paragraph>
                    </div>
                    <Avatar.Group
                      maxCount={4}
                      size="large"
                      maxStyle={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      }}
                    >
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
                      <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                      <Tooltip title="Ant User" placement="top">
                        <Avatar
                          style={{ backgroundColor: "#87d068" }}
                          icon={<UserOutlined />}
                        />
                      </Tooltip>
                      <Avatar
                        style={{ backgroundColor: "#1677ff" }}
                        icon={<AntDesignOutlined />}
                      />
                    </Avatar.Group>
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
