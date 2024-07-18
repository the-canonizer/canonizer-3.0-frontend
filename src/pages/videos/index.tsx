/* eslint-disable @next/next/no-img-element */
import { CaretRightOutlined } from "@ant-design/icons";
import { Card, Col, PageHeader, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getVideosContentApi } from "src/network/api/videos";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import Layout from "../../hoc/layout";

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
          <></>
        ) : (
          <>
            {categories?.map((category) => {
              return (
                <>
                  <PageHeader
                    className="px-0"
                    ghost
                    backIcon={<i className="icon-back text-xl"></i>}
                    onBack={() => null}
                    title="Videos"
                  />
                  <Card
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
                                className="video-inner-card"
                                bordered={false}
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
