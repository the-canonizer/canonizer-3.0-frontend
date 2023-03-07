import { useEffect, useState } from "react";
import { Slider, Popover, Typography } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  BackwardOutlined,
  ForwardOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import styles from "./timeBarControl.module.scss";

const { Title } = Typography;

const marks = {
  0: "0.5x",
  26: "0.75x",
  50: "1x(Normal)",
  75: "1.25x",
  100: "1.5x",
};

function TimelineSlider({
  mockData,
  setStart,
  start,
  setTimelineDescript,
  handleEventSelection,
  animationSpeed,
  setAnimationSpeed,
  iteration,
  setIteration,
  handleForwardOrBackord,
  isPlaying,
  setIsPlaying,
}) {
  const [intervalId, setIntervalId] = useState(null);

  const handleClick = () => {
    setStart(!start);
    if (isPlaying) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
    } else {
      const id = setInterval(() => {
        if (isPlaying && start) {
          setIteration((c) => c + 1);
        }
      }, animationSpeed);

      setIntervalId(id);
      setIsPlaying(true);
    }
  };
  const handleClickForward = () => {
    setIsPlaying(false);
    setStart(false);
    if (Object.keys(mockData).length - 1 !== iteration) {
      setIteration(iteration + 1);

      handleForwardOrBackord(iteration + 1);
    }

    // }
  };

  const handleClickBackword = () => {
    setIsPlaying(false);
    setStart(false);
    if (iteration > 0) {
      setIteration(iteration - 1);

      handleForwardOrBackord(iteration - 1);
    }
  };
  const onChange = (newValue) => {
    if (Object.keys(mockData).length == newValue) {
      setIsPlaying(false);
    }

    setIteration(newValue);
    handleEventSelection(newValue);
  };

  const handleSpeedChange = (playbackSpeed) => {
    if (playbackSpeed == 0) {
      setAnimationSpeed(1500);
    } else if (playbackSpeed == 26) {
      setAnimationSpeed(1250);
    } else if (playbackSpeed == 50) {
      setAnimationSpeed(1000);
    } else if (playbackSpeed == 75) {
      setAnimationSpeed(750);
    } else if (playbackSpeed == 100) {
      setAnimationSpeed(500);
    }
  };

  const content = (
    <div className="speed-controller">
      <Title level={4}>Playback speed</Title>
      <Slider
        marks={marks}
        defaultValue={50}
        step={null}
        tooltip={{ open: false }}
        onChange={handleSpeedChange}
      />
    </div>
  );
  const MarkPointsData = () => {
    let pdata: any = Object.keys(mockData);
    let obj = {};
    if (pdata.length - 1 < 4) {
      pdata.map((value, index) => {
        obj[index] = value;
      });
    } else {
      pdata.map((value, index) => {
        let a = (index + 1) * ((pdata.length - 1) / 4);
        if (Math.round(a) < pdata.length) {
          console.log("a value ", pdata[Math.round(a)].split("_")[1]);
          let datess = new Date(pdata[Math.round(a)]?.split("_")[1] * 1000);
          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const formattedDate = `${
            months[datess.getMonth()]
          } ${datess.getDate()},${datess.getFullYear()}`;
          obj[Math.round(a)] = formattedDate;
        }
      });
    }
    return obj;
  };

  useEffect(() => {
    if (Object.keys(mockData).length == iteration) {
      setIsPlaying(false);
      setIteration(0);
      setStart(false);
    }

    let showkey = Object.keys(mockData)[iteration];
    setTimelineDescript(mockData[showkey]?.event?.message);
  }, [iteration]);

  return (
    <>
      <div className={styles.timeBarControl}>
        <StepBackwardOutlined
          onClick={() => {
            handleClickBackword();
          }}
          className={styles.controlBtnSecond}
        />
        {/* <BackwardOutlined className={styles.controlBtn} /> */}
        {"     "}
        <div className={styles.playBtn} onClick={handleClick}>
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </div>
        {"   "}
        {/* <ForwardOutlined className={styles.controlBtn} onClick={handleClickForward} /> */}

        <StepForwardOutlined
          onClick={() => {
            handleClickForward();
          }}
          className={styles.controlBtnSecond}
        />
        <Popover content={content} title={false} trigger="click">
          <DashboardOutlined className="speed-icon" />
        </Popover>
      </div>
      <Slider
        className="rang-slider"
        onChange={onChange}
        value={Number(iteration)}
        marks={MarkPointsData()}
        min={0}
        max={Object?.keys(mockData).length - 1}
      />
    </>
  );
}

export default TimelineSlider;
