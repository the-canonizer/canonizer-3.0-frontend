import { Fragment } from "react";
import { Card, Typography } from "antd";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import { useSelector } from "react-redux";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DoubleRightOutlined } from "@ant-design/icons";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

import styles from "./HotTopic.module.scss";

import { RootState } from "src/store";
import { getTime } from "src/utils/generalUtility";

const { Text } = Typography;

function HotTopic() {
  /* eslint-enable */
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  const settings = {
    autoplay: false,
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    // autoplaySpeed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: styles.sliderCls,
    // centerPadding: "20px",
    dotsClass: styles.sliderDotsCls,
    // responsive: [
    //   { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    // ],
  };

  return (
    <Fragment>
      {topicData ? (
        <Slider {...settings}>
          {topicData?.map((topic) => (
            <Card
              title={topic?.title || "Hot Topic"}
              bordered={false}
              className={styles.hotopicCard}
              key={`data-card-${topic?.id}`}
              extra={
                (topic?.updated_at || topic?.created_at) && (
                  <Text className={styles.date}>
                    {moment(
                      getTime(topic?.updated_at || topic?.created_at)
                    ).format("MMMM DD, YYYY")}
                  </Text>
                )
              }
            >
              <div className={styles.imageSection}>
                <div className={styles.cont}>
                  {/* eslint-disable */}
                  {topic?.file_full_path && (
                    <Link
                      href={{
                        pathname: `/topic/${topic?.topic_num}-${
                          topic?.topic_name || ""
                        }/${topic?.camp_num || 1}-${
                          topic?.camp_name || "Agreement"
                        }`,
                      }}
                    >
                      <img
                        className={styles.imgLink}
                        width={"100%"}
                        height={350}
                        src={topic?.file_full_path}
                        alt=""
                      />
                    </Link>
                  )}
                  <div
                    className={`${styles.texts} ${
                      topic?.file_full_path ? "" : styles.bgWhite
                    }`}
                    key={`bgj_${topic?.id}`}
                  >
                    {/* eslint-enable  */}
                    <div
                      className={styles.imageLabel}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(topic?.description, {
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
                    {topic?.topic_name && topic?.topic_num && (
                      <Link
                        href={{
                          pathname: `/topic/${topic?.topic_num}-${
                            topic?.topic_name || ""
                          }/${topic?.camp_num || 1}-${
                            topic?.camp_name || "Agreement"
                          }`,
                        }}
                      >
                        <a className={styles.links}>
                          View Topic <DoubleRightOutlined />
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Slider>
      ) : null}
    </Fragment>
  );
}

export default HotTopic;
