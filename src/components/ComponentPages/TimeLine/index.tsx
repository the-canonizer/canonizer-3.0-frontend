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
    
   const data = await getEventLineApi({
    "topic_num": 1175,
    "camp_num": 2,
    "asOf": "default",
    "asofdate": 1677160704.161,
    "algorithm": "blind_popularity",
    "update_all": 1,
    "fetch_topic_history": null
})
debugger
   setMockData(data)
setData( data[Object.keys(data)[0]].payload_response)
   }

   apiCall()

  }, []);

  let iterationCount = 0;

  useInterval(() => {
    if (start && events.length > iteration) {
      setData(mockData[events[iteration]].payload_response);
      setEventDescription(mockData[events[iteration]].event?.message);

      setIteration(iteration + 1);
      iterationCount++;
    }
  }, 1000);

  const handleEventSelection = (index) => {
    setData(mockData[events[index]].payload_response);
    setEventDescription(mockData[events[index]].event?.message);
    setIteration(index);
  };

  return (
    <React.Fragment>
      <TimelineSlider
        mockData={mockData}
        setStart={setStart}
        start={start}
        setTimelineDescript={setTimelineDescript}
        handleEventSelection={handleEventSelection}
      />
      <div style={{ overflow: "hidden" }}>
        {
          data?.length &&
        <RacingBarChart data={data} />
        }
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
