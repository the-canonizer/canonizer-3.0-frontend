import { useEffect, useState } from "react";
import { Slider } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  BackwardOutlined,
  ForwardOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import styles from "./timeBarControl.module.scss";

function TimelineSlider({mockData, setStart, start, setTimelineDescript, handleEventSelection , animationSpeed, setAnimationSpeed, iteration, setIteration}) {
  
  const [count, setCount] = useState(0);

  const [forward, setForward] = useState(false);
  const [backward, setbackward] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showData, setShowData] = useState({});
  const handleClick = () => {
    setStart(!start);
    if (isPlaying) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
      setForward(false);
    } else {
      const id = setInterval(() => {
        setIteration((c) => c + 1);
      }, animationSpeed);

      setIntervalId(id);
      setIsPlaying(true);
    }
  };
  const handleClickForward = () => {
    if (forward) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
      setForward(false);
    } else {
      const id = setInterval(() => {
        setIteration((c) => c + 1);
      }, 100);

      setIntervalId(id);
      setForward(true);
    }
  };
  const onChange = (newValue) => {
    setIteration(newValue);
    handleEventSelection(newValue)
  };
  
  useEffect(() => {
    let showkey = Object.keys(mockData)[iteration];
    setShowData(mockData[showkey]);
    setTimelineDescript(mockData[showkey]?.event?.message);
  }, [iteration]);

  return (
    <>
      <div className={styles.timeBarControl}>
        <StepBackwardOutlined className={styles.controlBtnSecond} />
        <BackwardOutlined className={styles.controlBtn} />
        {"     "}
        <div className={styles.playBtn} onClick={handleClick}>
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </div>
        {"   "}
        <ForwardOutlined
          className={styles.controlBtn}
          onClick={handleClickForward}
        />
        <StepForwardOutlined className={styles.controlBtnSecond} />
      </div>
      <Slider
        className="rang-slider"
        onChange={onChange}
        value={Number(iteration)}
        // marks={marks}
        min={0}
        max={Object.keys(mockData).length - 1}
      />
     
    </>
  );
}

export default TimelineSlider;
