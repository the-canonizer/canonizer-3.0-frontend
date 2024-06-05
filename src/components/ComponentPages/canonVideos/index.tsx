/* eslint-disable @next/next/no-img-element */
import Hls from 'hls.js';

import React, { Fragment, useEffect, useRef, useState } from "react";
import { RadioChangeEvent, Typography, Radio, Card } from "antd";
import { useRouter } from "next/router";

import styles from "./style.module.scss";

import K from "src/constants";
import { getVideosApi, getVideosContentApi } from "src/network/api/videos";
import CustomSkelton from "../../common/customSkelton";
import VideoThumbnail from "../../../assets/image/video-thumbnail.jpg";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import videojsHlsQualitySelector from 'videojs-hls-quality-selector';

// Register the plugin with video.js
videojs.registerPlugin('hlsQualitySelector', videojsHlsQualitySelector);


const { Title } = Typography;

export default function CanonVideos() {
  const BaseVideosURL = `${K.Network.URL?.BaseVideosURL}videos/consciousness`;

  const playeref = useRef<any>({});
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [topic, setTopic] = useState("");
  const [loader, setLoader] = useState(false);
  const [videoResolution, setVideoResolution] = useState("");
  const [isHlsVideo, setIsHlsVideo] = useState(true);

  const router = useRouter();

  const HlsPlayer = ({ src, autoPlay = false ,width,onTimeUpdate}) => {
    const hls = new Hls();

    useEffect(() => {
      if (Hls.isSupported()) {
        hls.loadSource(src);
        hls.attachMedia(playeref.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            playeref.current.play();
          }
        });

        // Hls.Events.LEVEL_SWITCHED event to log changes in video quality.
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const level = hls.levels[data.level];
          console.log(`Switched to level: ${data.level}, Resolution: ${level.width}x${level.height}, Bitrate: ${level.bitrate}`);
        });

        // event Hls.Events.LEVEL_LOADING which is triggered before loading a new level. 
        // This can be used to log bandwidth-related information.
        hls.on(Hls.Events.LEVEL_LOADING, (event, data) => {
          const level = hls.levels[data.level];
          console.log(`Loading level: ${data.level}, Resolution: ${level.width}x${level.height}, Bitrate: ${level.bitrate}`);
        });
        
        //Logs the estimated bandwidth after each fragment is loaded, 
        // providing insight into how the player is adapting to network conditions
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          const currentTime = playeref.current.currentTime;
          const bandwidthEstimate = hls.bandwidthEstimate;
          console.log(`Fragment loaded at time: ${currentTime}, Estimated bandwidth: ${bandwidthEstimate} bps`);
        });

      } else if (playeref.current.canPlayType('application/vnd.apple.mpegurl')) {
        playeref.current.src = src;
        if (autoPlay) {
          playeref.current.play();
        }

        playeref.current.addEventListener('loadedmetadata', () => {
          console.log(`Loaded HLS stream with resolution: ${playeref.current.videoWidth}x${playeref.current.videoHeight}`);
        });
      }
  
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }, [src, autoPlay]);
  
    return <video ref={playeref} controls width={width} onTimeUpdate={onTimeUpdate}>
              <track
                kind="chapters"
                label="Locations"
                src={"/subs/" + vttPath() + ".vtt"}
                default>
              </track>
            </video>;
  };

  const VideoPlayer = ({ src, autoPlay = false }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
  
    useEffect(() => {
      if (playerRef.current) {
        playerRef.current = videojs(playerRef.current, {
          autoplay: autoPlay,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{
            src,
            type: 'application/x-mpegURL'
          }]
        });
  
        // Initialize the quality selector
        playerRef.current.hlsQualitySelector({
          displayCurrentQuality: true,
          vjsIconClass: 'vjs-icon-cog',
          placementIndex: 15,
          overrideNative: true
        });
  
        playerRef.current.on('loadedmetadata', () => {
          if (autoPlay) {
            playerRef.current.play();
          }
        });
  
        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
          }
        };
      }
    }, [src, autoPlay]);
  
    return (
      <div>
        <video ref={playerRef} className="video-js vjs-default-skin"  
         width={"100%"}
        >
          <track
            kind="chapters"
            label="Locations"
            src={"/subs/" + vttPath() + ".vtt"}
            default>
          </track>
        </video>
      </div>
    );
  };

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

    // let categoryId = router?.query?.video?.at(0).split("-")[0];
    // let categoryName = router?.query?.video?.at(0).split("-")[1];

    async function getTreeApiCall() {
      setLoader(true);
      let data = await getVideosApi();

      if (data?.status_code == 200) {
        setVideos(data?.data[0]?.videos);

        const videoss = data?.data[0]?.videos;

        if (q?.video?.at(1) || q?.format || q?.chapter) {
          const title = (q?.video?.at(1) || "").split("-");
          const join = title[0] == "" ? q?.video?.at(1) : title.slice(1).join(" ");
          const videoTitle = replaceString(
            spaceChangeToDash(join ?? q?.chapter as string, true),
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
  console.log("Topic ===>",topic);

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
    let asPath = isSpecialChapter ? `/videos/1-consciousness/${videoId}-${chapter}?format=${format}` : `/videos/consciousness/${chapter}?format=${format}`;
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

  return (
    <Fragment>
      <Card
        title=" Consciousness: Not a Hard Problem, Just a Color Problem"
        className="video-parent-card w-100"
      >
        <div className={`video-container ${styles.videosContainer}`}>
          <div className={`side-bar-wrap ${styles.sideBarWrap}`}>
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
                <Radio.Group
                  className={styles.radioGroup}
                  value={videoResolution}
                >
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
            className={`video-player-card ${styles.videoPlayer}`}
            data-testid="videoPlayer"
          >
            {videos && videoResolution ? (
              <>
                {
                  isHlsVideo ? <>
                      <h3>HLS Player</h3>
                      {/* <HlsPlayer src={"https://canon-hls.s3.us-east-2.amazonaws.com/output_multiple_formats/perceiving_a_strawberry.m3u8"} 
                        width={"100%"}
                        onTimeUpdate={updateTime}
                      /> */}
                    <VideoPlayer src="https://canon-hls.s3.us-east-2.amazonaws.com/output_multiple_formats/perceiving_a_strawberry.m3u8" autoPlay={true} />
                  </>:<>
                    <h3>HTML Player</h3>
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
                  </>
                }
                <div
                  className={`video-chap-content ${styles.vttComtainer}`}
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
      </Card>
      {/* <div className="w-100 pt-4 pb-4 ">
        <Title className={`text-center ${styles.pageTitle}`} level={1}>
          Consciousness: Not a Hard Problem, Just a Color Problem
        </Title>
      </div> */}
    </Fragment>
  );
}
