import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styles from "./style.module.scss";

const VideoPlayer = ({ videoSrc, vttSrc }) => {
  const videoRef = useRef(null);
  const [currentCue, setCurrentCue] = useState(null);

  const fetchVTT = async (url) => {
    const response = await fetch(url);
    const vttText = await response.text();
    return parseVTT(vttText);
  };
  
  const parseVTT = (vttText) => {
    const cues = [];
    const regex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\n|\n$|$)/g;
    let match;
    while ((match = regex.exec(vttText)) !== null) {
      const [_, start, end, text] = match;
      cues.push({
        start: parseTime(start),
        end: parseTime(end),
        text,
      });
    }
    return cues;
  };
  
  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseFloat(seconds)
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      fetchVTT(vttSrc).then((cues) => {
        const updateCue = () => {
          const currentTime = video.currentTime;
          const cue = cues.find(
            (cue) => currentTime >= cue.start && currentTime <= cue.end
          );
          setCurrentCue(cue);
        };

        video.addEventListener('timeupdate', updateCue);

        return () => {
          video.removeEventListener('timeupdate', updateCue);
        };
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });

      fetchVTT(vttSrc).then((cues) => {
        const updateCue = () => {
          const currentTime = video.currentTime;
          const cue = cues.find(
            (cue) => currentTime >= cue.start && currentTime <= cue.end
          );
          setCurrentCue(cue);
        };

        video.addEventListener('timeupdate', updateCue);

        return () => {
          video.removeEventListener('timeupdate', updateCue);
        };
      });
    }
  }, [videoSrc, vttSrc]);

  return (
    <div>
      <video 
        ref={videoRef} 
        controls 
        width={"100%"}
        height={"auto"}
      />
        {currentCue && (
            <div 
                className={`video-chap-content ${styles.vttComtainer}`} 
                dangerouslySetInnerHTML={{ __html: currentCue?.text }} 
            />

        )}
    </div>
  );
};



export default VideoPlayer;