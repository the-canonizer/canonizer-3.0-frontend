import React, { useEffect, useRef, useState } from "react";
import { RadioChangeEvent, Typography, Radio } from "antd";
import { useRouter } from "next/router";

import styles from "./style.module.scss";

import K from "src/constants";
import { getVideosContentApi } from "src/network/api/videos";
import CustomSkelton from "../../common/customSkelton";

const { Title } = Typography;

export default function CanonVideos() {
  const playeref = useRef<any>({});
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [topic, setTopic] = useState("");
  const [loader, setLoader] = useState(false);
  const [videoResolution, setVideoResolution] = useState("");

  const router = useRouter();

  const replaceString = (text: string, reverse: boolean = false) => {
    if (reverse) {
      let reverseText = text?.replace(/-/g, " ");
      return reverseText;
    } else {
      let updatedText = text?.replace(/\s+/g, "-");
      return updatedText;
    }
  };

  const handleVideoSelection = (videodata: any) => {
    playeref.current;

    router.query.title = replaceString(videodata?.title);
    router.query.resolution = videodata?.resolutions[0]?.title?.split(" ")[0];
    router.push(router, null, { shallow: true });

    setSelectedVideoId(videodata?.id);
    setVideoResolution(videodata?.resolutions[0]?.link);

    const node = document.getElementsByTagName("video")[0];
    node.src =
      K.Network.URL?.BaseVideosURL + "/" + videodata?.resolutions[0]?.link;
    node.play();
  };

  const onChange = (e: RadioChangeEvent, res) => {
    setVideoResolution(e.target.value);

    router.query.resolution = res?.split(" ")[0];
    router.push(router, null, { shallow: true });

    const node = document.getElementsByTagName("video")[0];
    node.src = K.Network.URL?.BaseVideosURL + "/" + e.target.value;
    node.play();
  };

  useEffect(() => {
    const q = router.query;
    async function getTreeApiCall() {
      setLoader(true);
      let data = await getVideosContentApi();

      if (data?.status_code == 200) {
        setVideos(data?.data);

        const videoss = data?.data;

        if (q?.title || q?.resolution) {
          const videoTitle = replaceString(q?.title as string, true);
          const filteredVideo = Object.values(videoss)?.filter((video) => {
            if (video["title"] === videoTitle) {
              return video;
            }
          });

          if (filteredVideo && filteredVideo?.length) {
            const selectedVideo = filteredVideo[0];

            let resLink = "";

            setSelectedVideoId(selectedVideo["id"]);

            selectedVideo["resolutions"]?.map((res) => {
              if (res?.title.includes(q?.resolution)) {
                setVideoResolution(res?.link);
                resLink = res?.link;
                return;
              }
            });

            const node = document.getElementsByTagName("video")[0];
            node.src = K.Network.URL?.BaseVideosURL + "/" + resLink;
            node.play();
          }
        } else {
          setVideoResolution(data?.data[0]?.resolutions[0]?.link);
        }
      }
      setLoader(false);
    }
    getTreeApiCall();
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
      router.query.duration = playeref?.current?.currentTime;
      router.push(router, null, { shallow: true });
    }
  }, [topic]);

  useEffect(() => {
    const ct = router?.query?.duration;
    setTimeout(() => {
      const node = document.getElementsByTagName("video")[0];
      if (node && ct) {
        node.currentTime = Number(ct);
      }
    }, 800);
  }, []);

  return (
    <>
      <div className="w-100 pt-4 pb-4 ">
        <Title className="text-center" level={1}>
          Consciousness: Not a Hard Problem, Just a Color Problem
        </Title>
      </div>
      <div className={styles.videosContainer}>
        <div className={styles.sideBarWrap}>
          {loader ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={7}
              stylingClass=""
              isButton={false}
              action={false}
              title={false}
            />
          ) : (
            <ul>
              {Object.values(videos)?.map((video) => (
                <li
                  className={video.id === selectedVideoId && styles.active}
                  onClick={() => handleVideoSelection(video)}
                  key={video?.id}
                >
                  {video?.title}
                </li>
              ))}
            </ul>
          )}
          <div>
            <Title level={5}>Video Format:</Title>

            {videos && !loader ? (
              <Radio.Group
                className={styles.radioGroup}
                value={videoResolution}
              >
                {videos[selectedVideoId - 1]?.resolutions?.map((data) => {
                  return (
                    <Radio
                      key={data?.id}
                      value={data?.link}
                      checked={videoResolution === data?.link}
                      onChange={(e) => onChange(e, data?.title)}
                    >
                      {data?.title}
                    </Radio>
                  );
                })}
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
        <div className={styles.videoPlayer}>
          {videos && videoResolution ? (
            <>
              <video
                onTimeUpdate={updateTime}
                width={"100%"}
                height={"auto"}
                controls
                ref={playeref}
                autoPlay
              >
                <source
                  src={K.Network.URL?.BaseVideosURL + "/" + videoResolution}
                  type="video/mp4"
                />
                <track
                  kind="chapters"
                  label="Locations"
                  src={"/subs/" + vttPath() + ".vtt"}
                  // ref={playeref2}
                  // onLoad={getChaptersReady}
                  default
                ></track>
              </video>
              <div
                className="video-chap-content"
                dangerouslySetInnerHTML={{
                  __html: topic,
                }}
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
        </div>
      </div>
    </>
  );
}
