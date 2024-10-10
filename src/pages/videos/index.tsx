/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Layout from "../../hoc/layout";
import { Row, Col, Image } from "antd";
import { Avatar, Card, Collapse } from "antd";
import { useRouter } from "next/router";
import SideBar from "../../components/ComponentPages/Home/SideBar";
import Title from "antd/lib/skeleton/Title";
import VideoThumbnail from "../../assets/image/video-thumbnail.jpg";
import { CaretRightOutlined } from "@ant-design/icons";
import { getVideosContentApi } from "src/network/api/videos";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import Skeleton from "react-loading-skeleton";
import CustomSkeleton from "@/components/common/customSkelton";

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
      <div className="pageContentWrap">
        {loader ? (
          <CustomSkeleton skeltonFor="videos" />
        ) : (
          <>
            {categories?.map((category) => {
              return (
                <>
                  <Card className="video-parent-card" title={category?.title}>
                    <Row gutter={[16, 16]}>
                      {category?.videos?.map((video) => {
                        return (
                          <>
                            <Col xs={24} sm={12} lg={8} xl={6}>
                              <Card
                                className="video-inner-card"
                                onClick={(e) => {
                                  onCardClick(e, video);
                                }}
                                cover={
                                  <div className="img-wrapper">
                                    <img
                                      alt=""
                                      src={
                                        process.env.NEXT_PUBLIC_BETA_URL +
                                        "files/videos/consciousness/" +
                                        video.thumbnail
                                      }
                                    />
                                    <CaretRightOutlined className="play-btn" />
                                  </div>
                                }
                              >
                                <Meta title={video?.title} />
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
