import React, { useEffect, useState } from "react";
import RacingBarChart from "./RacingBarChart.js";
import useInterval from "./useInterval";
// import "./App.css";
import HorizontalTimelineComp from "./HorizontalTimeline";
import TimelineSlider from "../eventLine/timelineSlider";
import { getEventLineApi } from "src/network/api/topicEventLineAPI";
import { useRouter } from "next/router.js";
import { useSelector } from "react-redux";
import { RootState } from "src/store/index.js";
import CustomSkelton from "@/components/common/customSkelton";
const getRandomIndex = (array) => {
  return Math.floor(array.length * Math.random());
};

function TimeLine({  setTimelineDescript }) {
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [mockData, setMockData] = useState({});
  const [eventDescription, setEventDescription] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter()
  
  const events = mockData && Object.keys(mockData);
  const [data, setData] = useState([]);
  const {
    algorithm,
  } = useSelector((state: RootState) => ({
    algorithm: state.filters?.filterObject?.algorithm,
  }))

  useEffect(() => {
    setLoading(true)
   async function apiCall() {
   const data = await getEventLineApi({
    "topic_num": router?.query?.camp[0].split("-")[0],
    "algorithm": algorithm,
    
})
debugger

   setMockData(data)
setData( data[Object.keys(data)[0]].payload_response)
   }

   apiCall()

    setLoading(false)
  }, [algorithm]);


  useInterval(() => {
    if (start && events.length > iteration) {
      setData(mockData[events[iteration]].payload_response);
      setEventDescription(mockData[events[iteration]].event?.message);
      // if(isPlaying){
        setIteration(iteration + 1);
      // }
    }
  }, animationSpeed);

  const handleEventSelection = (index) => {
    setData(mockData[events[index]].payload_response);
    setEventDescription(mockData[events[index]].event?.message);
    setIteration(index);
  };
  
  const handleForwardOrBackord = (iteration) => {

    setData(mockData[events[iteration]].payload_response);
    setEventDescription(mockData[events[iteration]].event?.message);
  }

  return (
    <React.Fragment>
      <TimelineSlider
        mockData={mockData}
        setStart={setStart}
        start={start}
        setTimelineDescript={setTimelineDescript}
        handleEventSelection={handleEventSelection}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        iteration={iteration}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
      />
      <div style={{ overflow: "hidden" }}>
        {
          loading ? 
          <CustomSkelton
          skeltonFor="tree"
          bodyCount={4}
          isButton={false}
          stylingClass=""
        />
        :
          // data?.length &&
        <RacingBarChart data={data} />
        }
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
