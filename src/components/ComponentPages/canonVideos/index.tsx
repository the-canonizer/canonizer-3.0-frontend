import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { RadioChangeEvent, Typography } from "antd";
import { Radio } from "antd";
import ReactPlayer from "react-player/lazy";
import K from "src/constants";
import { getVideosContentApi } from "src/network/api/videos";

const { Title } = Typography;

interface Props {}

export default function CanonVideos({}: Props): ReactElement {
  const playeref = useRef();
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(1);

  const handleVideoSelection = (videodata: any) => {
    setSelectedVideoId(videodata?.id);
    setVideoResolution(videodata?.resolutions[0]?.link);
  };

  const [videoResolution, setVideoResolution] = useState();
  const onChange = (e: RadioChangeEvent) => {
    setVideoResolution(e.target.value);
  };

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
                      {data?.title + "    " + data.id}
                    </Radio>
                  );
                })}
              </Radio.Group>
            )}
          </div>
        </div>
        <div className={styles.videoPlayer}>
          {videos ? (
            <ReactPlayer
              width={"100%"}
              height={"auto"}
              url={K.Network.URL?.BaseVideosURL + "/" + videoResolution}
              controls
              ref={playeref}
              // playing

              //        config={{ file: {
              //   tracks: [
              //     {kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true},
              //     {kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja'},
              //     {kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de'}
              //   ]
              // }}}

              config={{
                file: {
                  tracks: [
                    {
                      kind: "chapters",
                      src: "/subs/introduction.vtt",
                      srcLang: "en",
                      default: true,
                      label: "Locations",
                    },
                  ],
                },
              }}
            />
          ) : (
            <h1>Something went wrong!</h1>
          )}
          {/* <video>
        <source  src="https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"/>
        <track  kind="chapters" label="Locations" src='/subs/introduction.vtt'  default></track> 
      </video> */}
        </div>
      </div>
    </>
  );
}
