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
// eslint-disable-next-line @next/next/no-img-element
const { Meta } = Card;
const VideosPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loaderData, setLoaderData] = useState([
    {
      id: 1,
      title: "Consciousness: Not a Hard Problem, Just a Color Problem",
      type: "video",
      videos: [
        {
          id: 1,
          title: "Introduction",
          thumbnail: "introduction_thumb.png",
        },
        {
          id: 2,
          title: "Perceiving a Strawberry",
          thumbnail: "perceiving_a_strawberry_thumb.png",
        },
        {
          id: 3,
          title: "Differentiating Reality and Knowledge of Reality",
          thumbnail: "differentiate_reality_knowledge_thumb.png",
        },
        {
          id: 4,
          title: "The world in your head",
          thumbnail: "the_world_in_your_head_thumb.png",
        },
        {
          id: 5,
          title: "The Perception Of Size",
          thumbnail: "the_perception_of_size_thumb.png",
        },
        {
          id: 6,
          title: "Computational Binding",
          thumbnail: "computational_binding_thumb.png",
        },
        {
          id: 7,
          title: "Cognitive Knowledge",
          thumbnail: "cognitive_knowledge_thumb.png",
        },
        {
          id: 8,
          title: "Simulation Hypothesis",
          thumbnail: "simulation_hypothesis_thumb.png",
        },
        {
          id: 9,
          title: "Representational Qualia Theory Consensus",
          thumbnail: "representational_qualia_consensus_thumb.png",
        },
        {
          id: 10,
          title: "Conclusion",
          thumbnail: "conclusion_thumb.png",
        },
        {
          id: 10,
          title: "Conclusion",
          thumbnail: "conclusion_thumb.png",
        },
        {
          id: 10,
          title: "Conclusion",
          thumbnail: "conclusion_thumb.png",
        },
      ],
    },
  ]);

  const onCardClick = (e, video) => {
    e.stopPropagation();
    router.push(
      `videos/1-consciousness/${replaceSpecialCharacters(video.title, "-")}`
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
          <>
            {loaderData?.map((category) => {
              return (
                <>
                  <Card
                    className="video-parent-card"
                    title={<Skeleton width={460} count={1} enableAnimation />}
                  >
                    <Row gutter={[16, 16]}>
                      {category?.videos?.map((video) => {
                        return (
                          <>
                            <Col xs={24} sm={12} lg={8} xl={6}>
                              <Card
                                className="video-inner-card"
                                cover={
                                  <>
                                    <Skeleton style={{ height: "200px" }} />
                                  </>
                                }
                              >
                                <Meta title={<Skeleton />} />
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
                                        process.env.NEXT_PUBLIC_BASE_VIDEOS_URL +"videos/consciousness/" +
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

VideosPage.displayName = "VideosPage";

export default VideosPage;
