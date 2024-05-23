import { useEffect, useRef, useState } from "react";
import { Slider, Popover, Typography } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import styles from "./timeBarControl.module.scss";
import { useRouter } from "next/router";

const { Title } = Typography;

const marks = {
  0: "0.1x",
  12.5: "0.25x",
  25.0: "0.5x",
  37.5: "0.75x",
  50.0:"1x",
  62.5:"2.5x",
  75.0:"5x",
  87.5:"7.5x",
  100:"10x"
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
  eventId,
  setEventId,
  value,
  setValue
}: any) {
  const router = useRouter();
  const didMount = useRef(false);

  const [intervalId, setIntervalId] = useState(null);

  const [speedBar, setSpeedBar] = useState(false);

  useEffect(()=>{
    if (!didMount.current) {
      if(router?.asPath.includes("eventId")){
        setIteration(+router?.query?.eventId);
        handleEventSelection(+router?.query?.eventId);
        setEventId(+router?.query?.eventId)
      }
      didMount.current = true;
    }


  },[eventId])

  const handleClick = () => {
    setStart(!start);
    if (isPlaying) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
      setEventId(iteration)
    } else {
      const id = setInterval(() => {
        if (isPlaying && start) {
          setIteration((c) => c + 1);
        }
      }, animationSpeed);

      setIntervalId(id);
      setIsPlaying(true);
      setEventId(iteration)
    }
    setValue(1)
  };
  const handleClickForward = () => {
    setIsPlaying(false);
    setStart(false);
    if (Object.keys(mockData).length - 1 !== iteration) {
      setIteration(iteration + 1);
      setEventId(iteration + 1)
      setValue(1)

      handleForwardOrBackord(iteration + 1);
    }

    // }
  };

  const handleClickBackword = () => {
    setIsPlaying(false);
    setStart(false);
    if (iteration > 0) {
      setIteration(iteration - 1);
      setEventId(iteration - 1)
      setValue(1)

      handleForwardOrBackord(iteration - 1);
    }
  };
  const onChange = (newValue) => {
    if (Object.keys(mockData).length == newValue) {
      setIsPlaying(false);
    }
    setValue(1)

    {Object.keys(mockData)?.map((key) => {
        //Search the current iteration in data
        key?.split("_")[2] == newValue && (setEventId(key?.split("_")[2])) 
    })}

    setIteration(newValue);
    handleEventSelection(newValue);
  };

  const handleSpeedChange = (playbackSpeed) => {
    switch (playbackSpeed) {
      case 0:
        setAnimationSpeed(1350)
        break;
      case 12.5:
        setAnimationSpeed(1200)
        break;
      case 25.0:
        setAnimationSpeed(1050)
        break;
      case 37.5:
        setAnimationSpeed(900)
        break;
      case 50.0:
        setAnimationSpeed(750)
        break;
      case 62.5:
        setAnimationSpeed(600)
        break;
      case 75.0:
        setAnimationSpeed(450)
        break;
      case 87.5:
        setAnimationSpeed(300) 
        break;
      case 100:
        setAnimationSpeed(150)  
      break;   
    default:
      // do nothing
    }

    setSpeedBar(false);
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
        data-testid="slider"
      />
    </div>
  );
  const DateFormate = (datess, value = null) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let formattedDate = `${
      months[datess.getMonth()]
    } ${datess.getDate()}, ${datess
      .getYear()
      .toString()
      .slice(1)}<span style=display:none>${value}</span>`;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: formattedDate,
        }}
      />
    );
  };

  const formatter = (value) => {
    let pdata: any = Object.keys(mockData)?.sort();
    let formatedDate =
      pdata.length > 0 &&
      DateFormate(new Date(pdata[value]?.split("_")[1] * 1000), value);
    return formatedDate;
  };
  const MarkPointsData = () => {
    let pdata: any =
      mockData &&
      Object.keys(mockData)?.length > 0 &&
      Object.keys(mockData)?.sort();

    let obj = {};

    if (typeof window !== "undefined" && window.innerWidth > 767) {
      if (pdata?.length > 0 && pdata.length - 1 < 4) {
        pdata.map((value, index) => {
          let formattedDate = DateFormate(
            new Date(value?.split("_")[1] * 1000)
          );
          obj[index] = formattedDate;
        });
      } else {
        pdata?.length > 0 &&
          pdata?.map((value, index) => {
            if (index == 0) {
              obj[index] = DateFormate(new Date(value?.split("_")[1] * 1000));
            }
            let pointDiff = (index + 1) * ((pdata.length - 1) / 4);
            if (Math.round(pointDiff) < pdata.length) {
              let datess = new Date(
                pdata[Math.round(pointDiff)]?.split("_")[1] * 1000
              );
              let formattedDate = DateFormate(datess);
              obj[Math.round(pointDiff)] = formattedDate;
            }
          });
      }
    } else {
      pdata?.length > 0 &&
        pdata.map((value, index) => {
          if (index == 0) {
            obj[index] = DateFormate(new Date(value?.split("_")[1] * 1000));
          }
          let pointDiff = (index + 1) * ((pdata.length - 1) / 2);
          if (Math.round(pointDiff) < pdata.length) {
            let datess = new Date(
              pdata[Math.round(pointDiff)]?.split("_")[1] * 1000
            );
            let formattedDate = DateFormate(datess);
            obj[Math.round(pointDiff)] = formattedDate;
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
    let showkey = Object.keys(mockData).sort()[iteration];
    let sortMockData = Object.keys(mockData).sort();
    let mappedArr = [];
    for (let i = 0; i < Object.keys(mockData).length; i++) {
      if (showkey == sortMockData[i]) {
        mappedArr.unshift({
          message: mockData[sortMockData[i]]?.event?.message,
          eventDate: sortMockData[i]?.split("_")[1],
          id: mockData[sortMockData[i]]?.event?.id,
          url: mockData[sortMockData[i]]?.event?.url,
        });
        break;
      }

      mappedArr.unshift({
        message: mockData[sortMockData[i]]?.event?.message,
        eventDate: sortMockData[i]?.split("_")[1],
        id: mockData[sortMockData[i]]?.event?.id,
        url: mockData[sortMockData[i]]?.event?.url,
      });
    }
    setTimelineDescript(mappedArr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration, mockData]);

  return (
    <>
      <div
        className={`${styles.timeBarControl} ${
          mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent
            ? ""
            : styles.disablePlayBtn
        }`}
        data-testid="time-bar-control"
      >
        <StepBackwardOutlined
          onClick={() => {
            if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
              handleClickBackword();
            }
          }}
          className={styles.controlBtnSecond}
          data-testid="backward-button"
        />
        {/* <BackwardOutlined className={styles.controlBtn} /> */}
        {"     "}
        <div
          className={`${styles.playBtn}`}
          onClick={() => {
            if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
              handleClick();
            }
          }}
          data-testid="play-button"
        >
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </div>
        {"   "}
        {/* <ForwardOutlined className={styles.controlBtn} onClick={handleClickForward} /> */}

        <StepForwardOutlined
          onClick={() => {
            if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
              handleClickForward();
            }
          }}
          className={styles.controlBtnSecond}
          data-testid="forward-button"
        />
        <Popover
          content={content}
          title={false}
          trigger="hover"
          open={speedBar}
          onOpenChange={(newOpen) => {
            setSpeedBar(newOpen);
          }}
        >
          <DashboardOutlined
            className={`${"speed-icon"}  ${
              mockData && mockData[Object.keys(mockData)[1]]?.firstEvent
                ? styles.disableIcon
                : ""
            }`}
            data-testid="speed-icon"
          />
        </Popover>
      </div>
      {mockData && (
        <Slider
          disabled={
            mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent
              ? false
              : true
          }
          className={`${
            mockData && Object.keys(mockData).length > 0
              ? "rang-slider"
              : "skeleton-rangslider"
          }`}
          tooltip={{
            open: true,
            formatter,
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          }}
          onChange={onChange}
          value={Number(iteration)}
          marks={MarkPointsData()}
          min={0}
          max={Object?.keys(mockData).length - 1}
          data-testid="slider"
        />
      )}
    </>
  );
}

export default TimelineSlider;
