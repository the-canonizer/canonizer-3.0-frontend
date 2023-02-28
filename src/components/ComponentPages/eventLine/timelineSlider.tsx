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

function TimelineSlider({mockData, setStart, start, setTimelineDescript, handleEventSelection , animationSpeed, setAnimationSpeed, iteration, setIteration, handleForwardOrBackord, isPlaying, setIsPlaying}) {
  
  
  const [intervalId, setIntervalId] = useState(null);
  

  const handleClick = () => {
    setStart(!start);
    if (isPlaying) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
      
    } else {
      const id = setInterval(() => {
        if(isPlaying && start){
          setIteration((c) => c + 1);
        }
      }, animationSpeed);

      setIntervalId(id);
      setIsPlaying(true);
    }
  };
  const handleClickForward = () => {
 
      setIsPlaying(false)
      setStart(false)
      if(Object.keys(mockData).length - 1 !== iteration){
      setIteration(iteration + 1)
    
      handleForwardOrBackord(iteration+1)
      }
      
    // }
  };

  const handleClickBackword = () => {
    

      setIsPlaying(false)
      setStart(false)
      if(iteration > 0){

        setIteration(iteration - 1)
     
        handleForwardOrBackord(iteration - 1)
      }
 
  };
  const onChange = (newValue) => {
    if(Object.keys(mockData).length  == newValue){
      setIsPlaying(false)
    }
    
    setIteration(newValue);
    handleEventSelection(newValue)
  };
  
  useEffect(() => {
    if(Object.keys(mockData).length == iteration){
      setIsPlaying(false)
      setIteration(0)
      setStart(false)
    }
    
    let showkey = Object.keys(mockData)[iteration];
    setTimelineDescript(mockData[showkey]?.event?.message);
  }, [iteration]);

  return (
    <>
      <div className={styles.timeBarControl}>
        <StepBackwardOutlined  onClick={()=>{handleClickBackword()}} className={styles.controlBtnSecond} />
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
        <StepForwardOutlined onClick={()=>{handleClickForward()}} className={styles.controlBtnSecond} />
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
