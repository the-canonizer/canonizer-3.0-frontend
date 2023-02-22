import React, { useEffect, useState } from "react";
import RacingBarChart from "./RacingBarChart.js";
import useInterval from "./useInterval";
// import "./App.css";
import HorizontalTimelineComp from "./HorizontalTimeline";
import TimelineSlider from "../eventLine/timelineSlider";
import { getEventLineApi } from "src/network/api/topicEventLineAPI";
const getRandomIndex = (array) => {
  return Math.floor(array.length * Math.random());
};

function TimeLine({  setTimelineDescript }) {
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [mockData, setMockData] = useState({});
  const [eventDescription, setEventDescription] = useState("Hello");
  
  const events = Object.keys(mockData);
  const [data, setData] = useState(
   []
    
  );


  useEffect(() => {
   async function apiCall() {
    
   const data = await getEventLineApi({})
   setMockData(data)
setData( data[Object.keys(data)[0]].data)
   }

   apiCall()

  }, []);

  let iterationCount = 0;

  useInterval(() => {
    if (start && events.length > iteration) {
      setData(mockData[events[iteration]].data);
      setEventDescription(mockData[events[iteration]].event?.description);

      setIteration(iteration + 1);
      iterationCount++;
    }
  }, 1000);

  const handleEventSelection = (index) => {
    setData(mockData[events[index]].data);
    setEventDescription(mockData[events[index]].event?.description);
    setIteration(index);
  };

  return (
    <React.Fragment>
      <TimelineSlider
        setStart={setStart}
        start={start}
        setTimelineDescript={setTimelineDescript}
      />
      <div style={{ overflow: "hidden" }}>
        <RacingBarChart data={data} />
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
