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
// eslint-disable-next-line @next/next/no-img-element
const { Meta } = Card;
const VideosPage = () => {
  
  const router = useRouter();
  const [categories, setCategories] = useState(null);

  const onCardClick = (e,video) => {
    e.stopPropagation();
    console.log("Card Clicked ===>",`videos/${video.id}/${replaceSpecialCharacters(video.title,"-")}`);
    router.push(`videos/${video.id}/${replaceSpecialCharacters(video.title,"-")}}`);
  };

  const getVideoCategories = async () => {
    let data = await getVideosContentApi();
    setCategories(data?.data)
  }

  useEffect(() => {
    getVideoCategories()
  }, []);

  return (
    <Layout routeName={"video"}>
      <div className="pageContentWrap">
        {
          categories?.map((category) => {
            return (
              <>
                <Card
                  className="video-parent-card"
                  title={category?.title}
                >
                  <Row gutter={[16, 16]}>
                    {category?.videos?.map((video) => {
                      return (
                        <>
                          <Col xs={24} sm={12} lg={8} xl={6}>
                            <Card
                              className="video-inner-card"
                              onClick={(e) => {
                              }}
                              cover={
                                <>
                                  <img alt="" src={video.thumbnail.png} />
                                  <CaretRightOutlined className="play-btn" />
                                </>
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
            )
          })
        }
      </div>
    </Layout>
  );
};

VideosPage.displayName = "VideosPage";

export default VideosPage;
