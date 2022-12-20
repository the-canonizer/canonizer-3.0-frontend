import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { RadioChangeEvent, Typography } from "antd";
import { Radio } from "antd";

import K from "src/constants";
import { getVideosContentApi } from "src/network/api/videos";

const { Title } = Typography;

export default function CanonVideos() {
  const playeref = useRef<any>({});
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [topic, setTopic] = useState("");

  const handleVideoSelection = (videodata: any) => {
    playeref.current;
    setSelectedVideoId(videodata?.id);
    setVideoResolution(videodata?.resolutions[0]?.link);
    const node = document.getElementsByTagName("video")[0];
    node.src =
      K.Network.URL?.BaseVideosURL + "/" + videodata?.resolutions[0]?.link;
    node.play();
  };

  const [videoResolution, setVideoResolution] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    setVideoResolution(e.target.value);
    const node = document.getElementsByTagName("video")[0];
    node.src = K.Network.URL?.BaseVideosURL + "/" + e.target.value;
    node.play();
  };

  function updateTime() {
    console.log("update", playeref);
    if (topic != playeref?.current?.textTracks[0]?.activeCues[0]?.text) {
      setTopic(playeref?.current?.textTracks[0]?.activeCues[0]?.text);
    }
  }

  useEffect(() => {
    async function getTreeApiCall() {
      let data = await getVideosContentApi();
      if (data?.status_code == 200) {
        setVideos(data?.data);
        setVideoResolution(data?.data[0]?.resolutions[0].link);
      }
    }
    getTreeApiCall();
  }, []);

  function vttPath() {
    let path = videoResolution?.split("_");
    let finalPath = path?.splice(0, path.length - 1)?.join("_");
    return finalPath;
  }

  return (
    <>
      <div className="w-100 pt-4 pb-4 ">
        <Title className="text-center" level={1}>
          Consciousness: Not a Hard Problem, Just a Color Problem
        </Title>
      </div>
      <div className={styles.videosContainer}>
        <div className={styles.sideBarWrap}>
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
          <div>
            <Title level={5}>Video Format:</Title>

            {videos && (
              <Radio.Group
                className={styles.radioGroup}
                onChange={onChange}
                value={videoResolution}
              >
                {videos[selectedVideoId - 1]?.resolutions?.map((data) => {
                  return (
                    <Radio key={data?.id} value={data?.link}>
                      {data?.title}
                    </Radio>
                  );
                })}
              </Radio.Group>
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
                dangerouslySetInnerHTML={{
                  __html: topic,
                }}
              ></div>
            </>
          ) : (
            <h1>Something went wrong!</h1>
          )}
        </div>
      </div>
    </>
  );
}
