import Link from "next/link";
import React, { ReactElement, useRef, useState } from "react";
import styles from "./style.module.scss";
import { RadioChangeEvent, Typography } from "antd";
import { Radio } from "antd";
import ReactPlayer from "react-player/lazy";

const { Title } = Typography;
// Render a YouTube video player

interface Props {}

export default function CanonVideos({}: Props): ReactElement {
  const playeref = useRef();
  // debugger
  console.log("object", playeref);
  const handleOnReady = (player) => {};

  let videosCollection = {
    1: {
      id: 1,
      label: "Introduction",
      // url:"https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
      url: "https://canonizer.com/videos/consciousness/introduction_",
    },
    2: {
      id: 2,
      label: "Perceiving a Strawberry",
      // url:'/sample-video/file_example_mp4_1920_18mg.m3u8'
      url: "https://canonizer.com/videos/consciousness/perceiving_a_strawberry_",
    },
    3: {
      id: 3,
      label: "Differentiating Reality and Knowledge of Reality",
      url: "https://canonizer.com/videos/consciousness/differentiate_reality_knowledge_",
    },
    4: {
      id: 4,
      label: "Computational Binding",
      url: "https://canonizer.com/videos/consciousness/",
    },
    5: {
      id: 5,
      label: "Cognitive Knowledge",
      url: "https://canonizer.com/videos/consciousness/cognitive_knowledge_",
    },
    6: {
      id: 6,
      label: "Simulation_Hypothesis",
      url: "https://canonizer.com/videos/consciousness/simulation_hypothesis_",
    },
    7: {
      id: 7,
      label: "Representational Qualia Theory Consensus",
      url: "https://canonizer.com/videos/consciousness/representational_qualia_consensus_",
    },
    8: {
      id: 8,
      label: "Conclusion",
      url: "https://canonizer.com/videos/consciousness/conclusion_",
    },
  };

  const [videos, setVideos] = useState(videosCollection);
  const [selectedVideoId, setSelectedVideoId] = useState(1);

  const handleVideoSelection = (id: number) => {
    setSelectedVideoId(id);
  };

  const [videoResolution, setVideoResolution] = useState(360);
  const onChange = (e: RadioChangeEvent) => {
    setVideoResolution(e.target.value);
  };

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
                onClick={() => handleVideoSelection(video.id)}
              >
                {video.label}
              </li>
            ))}
          </ul>
          <div>
            <Title level={5}>Video Format:</Title>
            <Radio.Group
              className={styles.radioGroup}
              onChange={onChange}
              value={videoResolution}
            >
              <Radio value={360}>360 P</Radio>
              <Radio value={720}>720 P</Radio>
              <Radio value={1080}>1080 P</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.videoPlayer}>
          {videosCollection[selectedVideoId]?.url ? (
            <ReactPlayer
              width={"100%"}
              height={"auto"}
              url={`${
                videosCollection[selectedVideoId]?.url + videoResolution
              }.mp4`}
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
