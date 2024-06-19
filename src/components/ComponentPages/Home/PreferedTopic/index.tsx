import { Fragment } from "react";
import { Popover, Typography, Row, Col, Avatar, Tooltip } from "antd";
import {
  EyeOutlined,
  FlagOutlined,
  UserOutlined,
  AntDesignOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";

const PreferedTopics = () => {
  /* eslint-enable */
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-base font-bold uppercase">
            Your preferred topics{" "}
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <div className="mt-1">
        <Row gutter={20} className="items-stretch">
          {topicData?.slice(0, 6)?.map((ft) => (
            <Col
              xl={8}
              lg={12}
              md={24}
              xs={24}
              className="mb-4 self-stretch h-[250px] xl:h-full"
              key={ft?.id}
            >
              <CommonCard
                className={`border-0 h-full hover:*:shadow-lg fullHeightCard`}
              >
                <div className="flex justify-between pb-2 align-center">
                  <Typography.Paragraph className="m-0 text-medium font-bold font-inter">
                    {ft?.title}
                  </Typography.Paragraph>
                  <div className="hidden hover:block">
                    <RightOutlined className="text-black p-1 text-medium" />
                  </div>
                </div>
                <div
                  className="text-base font-inter font-normal mb-3 text-black opacity-80 leading-26 overflow-hidden line-clamp-4"
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
                <div className="flex justify-between pt-3 mt-auto xl:flex-col sm:flex-col">
                  <div className="text-left flex xl:flex-col sm:flex-col">
                    <Popover content="Share Topic" placement="top">
                      <Typography.Paragraph className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex items-center leading-1 mb-0 mr-3">
                        <FlagOutlined className="text-black p-1 text-medium" />
                        <Link href="">
                          <a className="text-blue text-base font-inter font-medium hover:hblue">
                            General
                          </a>
                        </Link>
                      </Typography.Paragraph>
                    </Popover>
                    <Typography.Paragraph className="m-0 text-light font-medium font-inter flex items-center">
                      <EyeOutlined className="text-black p-1 text-medium" /> 123
                    </Typography.Paragraph>
                  </div>
                  <Avatar.Group
                    maxCount={4}
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
              </CommonCard>
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};

export default PreferedTopics;
