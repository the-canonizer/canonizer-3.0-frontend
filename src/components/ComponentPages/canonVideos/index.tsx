/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  RadioChangeEvent,
  Typography,
  Radio,
  Card,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Select,
} from "antd";
import { useRouter } from "next/router";

import K from "src/constants";
import { getVideosApi } from "src/network/api/videos";
import CustomSkelton from "../../common/customSkelton";
import { CodepenCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import Facebook from "../../../assets/image/facebook.svg";
import Linkdhn from "../../../assets/image/linkedIn.svg";
import Twitter from "../../../assets/image/twitter.svg";

const { Title } = Typography;

export default function CanonVideos() {
  const BaseVideosURL = `${K.Network.URL?.BaseVideosURL}videos/consciousness`;

  const playeref = useRef<any>({});
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [topic, setTopic] = useState("");
  const [loader, setLoader] = useState(false);
  const [videoResolution, setVideoResolution] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (router?.route === "/videos/consciousness") {
      let { chapter, ...restq }: any = { ...router.query };

      let route = router.pathname + "/introduction";

      if (chapter) {
        route =
          router.pathname +
          "/" +
          spaceChangeToDash(replaceString(chapter as string, true));
      }

      router.push(
        {
          pathname: route,
          query: {
            ...restq,
          },
        },
        null,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceString = (text: string, reverse: boolean = false) => {
    if (reverse) {
      let reverseText;
      if (text?.includes("_")) {
        reverseText = text?.replace(new RegExp("_", "g"), " ");
      } else {
        reverseText = text?.replace(new RegExp("\\+", "g"), " ");
      }
      return reverseText;
    } else {
      let updatedText = text?.replace(/\s+/g, " ")?.toLowerCase();
      return updatedText;
    }
  };

  const spaceChangeToDash = (text: string, reverse: boolean = false) => {
    if (reverse) {
      let reverseText;
      if (text?.includes("_")) {
        reverseText = text?.replace(new RegExp("_", "g"), "-");
      } else {
        reverseText = text?.replace(new RegExp("\\-", "g"), "_");
      }
      return reverseText;
    } else {
      let updatedText = text?.replace(/\s+/g, "-")?.toLowerCase();
      return updatedText;
    }
  };

  const handleVideoSelection = (videodata: any) => {
    playeref.current;

    addQueryParams(
      spaceChangeToDash(videodata?.title),
      videodata?.resolutions[0]?.title?.split(" ")[0],
      null,
      videodata?.id
    );

    setSelectedVideoId(videodata?.id);
    setVideoResolution(videodata?.resolutions[0]?.link);

    const node = document.getElementsByTagName("video")[0];
    node.src = BaseVideosURL + "/" + videodata?.resolutions.at(0)?.link;
    node.play();
  };

  const onChange = (e: RadioChangeEvent, format: string) => {
    setVideoResolution(e.target.value);

    const filtredVides = videos?.filter((vd) => vd?.id === selectedVideoId);
    if (filtredVides && filtredVides.length) {
      addQueryParams(
        spaceChangeToDash(filtredVides[0].title),
        format?.split(" ")[0],
        null,
        filtredVides[0]?.id
      );
    }

    const node = document.getElementsByTagName("video")[0];
    if (node) {
      node.src = BaseVideosURL + "/" + e.target.value;
      node.play();
    }
  };

  useEffect(() => {
    const q = router.query;

    async function getTreeApiCall() {
      setLoader(true);
      let data = await getVideosApi();

      if (data?.status_code == 200) {
        setVideos(data?.data[0]?.videos);

        const videoss = data?.data[0]?.videos;

        if (q?.video?.at(1) || q?.format || q?.chapter) {
          const title = (q?.video?.at(1) || "").split("-");
          const join =
            title[0] == "" ? q?.video?.at(1) : title.slice(1).join(" ");
          const videoTitle = replaceString(
            spaceChangeToDash(join ?? (q?.chapter as string), true),
            true
          );
          const filteredVideo = Object.values(videoss)?.filter((video) => {
            if (video["title"]?.toLowerCase() === videoTitle?.toLowerCase()) {
              return video;
            }
          });

          if (filteredVideo && filteredVideo?.length) {
            const selectedVideo = filteredVideo[0];

            let resLink = "";

            setSelectedVideoId(selectedVideo["id"]);

            selectedVideo["resolutions"]?.map(
              (format: {
                title: string | (string | string[])[];
                link: React.SetStateAction<string>;
              }) => {
                if (format?.title?.includes((q?.format as string) || "360")) {
                  setVideoResolution(format?.link);
                  resLink = format?.link as string;
                  return;
                }
              }
            );

            const node = document.getElementsByTagName("video")[0];
            if (node) {
              node.src = BaseVideosURL + "/" + resLink;
            }
          }
        } else {
          setVideoResolution(
            data?.data?.at(0)?.videos?.at(0)?.resolutions?.at(0)?.link
          );
        }
      }
      setLoader(false);
    }
    getTreeApiCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateTime() {
    if (
      playeref?.current?.textTracks[0]?.activeCues &&
      topic != playeref?.current?.textTracks[0]?.activeCues[0]?.text
    ) {
      setTopic(playeref?.current?.textTracks[0]?.activeCues[0]?.text);
    }
  }

  function vttPath() {
    let path = videoResolution?.split("_");
    let finalPath = path?.splice(0, path.length - 1)?.join("_");
    return finalPath;
  }

  useEffect(() => {
    if (topic) {
      const filtredVides = videos?.filter((vd) => vd?.id === selectedVideoId);
      if (filtredVides && filtredVides.length) {
        const splitedarray = videoResolution?.split("_");
        const format = splitedarray[splitedarray?.length - 1]?.split(".")[0];
        addQueryParams(
          spaceChangeToDash(replaceString(filtredVides[0].title)),
          format,
          playeref?.current?.currentTime,
          filtredVides[0]?.id
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    const ct = router?.query?.t;
    setTimeout(() => {
      const node = document.getElementsByTagName("video")[0];
      if (node && ct) {
        node.currentTime = Number(ct);
      }
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addQueryParams(
    chapter: string,
    format: string | string[],
    t: string | string[],
    videoId: string[]
  ) {
    const isSpecialChapter = router.query.video?.[0] === "1-consciousness";

    router.query.video = isSpecialChapter
      ? [router.query.video?.[0], chapter]
      : [chapter];
    router.query.format = format;
    router.query.video_id = String(videoId);
    let asPath = isSpecialChapter
      ? `/videos/1-consciousness/${videoId}-${chapter}?format=${format}`
      : `/videos/consciousness/${chapter}?format=${format}`;
    if (t) {
      router.query.t = t;
      asPath += `&t=${t}`;
    } else {
      // eslint-disable-next-line no-unused-vars
      const { t, ...rest } = router?.query;
      router.query = rest;
    }
    // isSpecialChapter
    //   ? router?.push(router, null, { shallow: true })
    // :
    router.push(router.pathname, asPath, { shallow: true });
  }
  const menu = (
    <Menu className="share-menu">
      <Menu.Item>
        <img src={Facebook.src} alt="facebook" />
      </Menu.Item>
      <Menu.Item>
        <img src={Twitter.src} alt="twitter" />
      </Menu.Item>
      <Menu.Item>
        <img src={Linkdhn.src} alt="linkdhn" />
      </Menu.Item>
    </Menu>
  );
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Fragment>
      <div className="video-parent-card w-full">
        <PageHeader
          className="video-detail-header px-0 py-10"
          ghost
          backIcon={<i className="icon-back text-xl"></i>}
          onBack={() => null}
          title="Consciousness: Not a Hard Problem, Just a Color Problem"
        />
        <div className="video-container">
          <div className="side-bar-wrap ">
            {loader ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={7}
                stylingClass=""
                isButton={false}
                action={false}
                title={false}
                data-testid="skeleton"
              />
            ) : (
              <ul>
                {Object.values(videos)?.map((video) => {
                  return (
                    <li
                      className={video.id === selectedVideoId ? "active" : ""}
                      onClick={() => handleVideoSelection(video)}
                      key={video?.id}
                      data-testid={video?.title}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_BETA_URL}files/videos/consciousness/${video?.thumbnail}`}
                        alt=""
                        style={{ minHeight: "50px" }}
                      />
                      {video?.title}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="video-formats">
              <Title level={5}>Video Format:</Title>

              {videos && !loader ? (
                <Radio.Group value={videoResolution}>
                  {videos[selectedVideoId - 1]?.resolutions?.map(
                    (data: {
                      id: React.Key;
                      link: string;
                      title:
                        | boolean
                        | React.ReactChild
                        | React.ReactFragment
                        | React.ReactPortal;
                    }) => {
                      return (
                        <Radio
                          key={data?.id}
                          value={data?.link}
                          checked={videoResolution === data?.link}
                          onChange={(e) => onChange(e, data?.title as string)}
                          data-testid={data?.link}
                        >
                          {data?.title}
                        </Radio>
                      );
                    }
                  )}
                </Radio.Group>
              ) : (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={3}
                  stylingClass=""
                  isButton={false}
                  action={false}
                  title={false}
                />
              )}
            </div>
          </div>
          <Card
            className="video-player-card"
            data-testid="videoPlayer"
            bordered={false}
          >
            {videos && videoResolution ? (
              <>
                <Select
                  defaultValue="Introduction"
                  size="large"
                  className="video-select mb-5 lg:hidden"
                  suffixIcon={<i className="icon-chevron-down text-black"></i>}
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "introduction",
                      label: "Introduction",
                    },
                    {
                      value: "conclusion",
                      label: "Conclusion",
                    },
                    {
                      value: "differentiating",
                      label: "Differentiating Reality and Knowledge of Reality",
                    },
                  ]}
                />
                <video
                  onTimeUpdate={updateTime}
                  width={"100%"}
                  height={"auto"}
                  controls
                  ref={playeref}
                >
                  <source
                    data-testid="playerId"
                    src={BaseVideosURL + "/" + videoResolution}
                    type="video/mp4"
                  />
                  <track
                    kind="chapters"
                    label="Locations"
                    src={"/subs/" + vttPath() + ".vtt"}
                    default
                  ></track>
                </video>
                <div className="share-wrapper">
                  <Title level={5} className="text-canBlack">
                    Topic
                  </Title>
                  <Dropdown overlay={menu}>
                    <Button
                      size="small"
                      className="flex items-center"
                      type="primary"
                      ghost
                    >
                      Share
                      <ShareAltOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <Title
                  level={5}
                  className="p-5 mb-5 text-canBlack border-b border-[#F0F0F0]"
                >
                  Chapters
                </Title>

                <div
                  className="video-chap-content"
                  dangerouslySetInnerHTML={{ __html: topic }}
                ></div>
              </>
            ) : (
              <CustomSkelton
                bodyCount
                stylingClass
                isButton
                height={400}
                skeltonFor="video"
              />
            )}
          </Card>
        </div>
      </div>
    </Fragment>
  );
}
