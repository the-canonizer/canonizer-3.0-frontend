//* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Layout from "../../hoc/layout";
import { Row, Col } from "antd";
import { Card } from "antd";
import { useRouter } from "next/router";
import { CaretRightOutlined } from "@ant-design/icons";
import { getVideosContentApi } from "src/network/api/videos";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import CustomSkeleton from "../../components/common/customSkelton";
import Image from "next/image";

// eslint-disable-next-line @next/next/no-img-element
const { Meta } = Card;
const VideosPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState(null);
  const [loader, setLoader] = useState(false);

  const onCardClick = (e, video) => {
    e.stopPropagation();
    router.query.video_id = video.id;
    router.push(
      `videos/1-consciousness/${video?.id}-${replaceSpecialCharacters(
        video.title,
        "-"
      )}`
    );
  };

  const getVideoCategories = async () => {
    setLoader(true);
    let data = await getVideosContentApi();
    setCategories(data?.data);
    setLoader(false);
  };

  useEffect(() => {
    getVideoCategories();
  }, []);

  return (
    <Layout routeName={"video"}>
      <div className="video-wrapper">
        {loader ? (
          <>
            <CustomSkeleton skeltonFor="videos" />
          </>
        ) : (
          <>
            {categories?.map((category) => {
              return (
                <>
                  <Card
                    id="videos-category-title"
                    className="video-parent-card"
                    bordered={false}
                    title={category?.title}
                  >
                    <Row gutter={[16, 16]}>
                      {category?.videos?.map((video) => {
                        return (
                          <>
                            <Col xs={24} sm={12} lg={8} xl={6}>
                              <Card
                                id="videos-category-card"
                                className="video-inner-card"
                                bordered={false}
                                onClick={(e) => {
                                  onCardClick(e, video);
                                }}
                                cover={
                                  <div
                                    id="videos-category-thumbnail-container"
                                    className="img-wrapper"
                                  >
                                    <Image
                                      layout="fill"
                                      id="videos-category-thumbnail"
                                      alt=""
                                      src={`${process.env.NEXT_PUBLIC_BETA_URL}files/videos/consciousness/${video.thumbnail}`}
                                    />
                                    <CaretRightOutlined
                                      id="videos-category-play-icon"
                                      className="play-btn"
                                    />
                                  </div>
                                }
                              >
                                <div id="videos-category-meta-title">
                                  <Meta
                                    title={video?.title}
                                    className="text-sm [&_.ant-card-meta-title]:!text-sm"
                                  />
                                </div>
                              </Card>
                            </Col>
                          </>
                        );
                      })}
                    </Row>
                  </Card>
                </>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
};

VideosPage.displayName = "VideoListingPage";

export default VideosPage;
