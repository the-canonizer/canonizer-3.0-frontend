import React, { useEffect, useState } from "react";
import RacingBarChart from "./RacingBarChart.js";
import useInterval from "./useInterval";
// import "./App.css";
import TimelineSlider from "../eventLine/TimelineSlider";
import { getEventLineApi } from "src/network/api/topicEventLineAPI";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store/index.js";
import CustomSkelton from "../../common/customSkelton";
const getRandomIndex = (array) => {
  return Math.floor(array.length * Math.random());
};

function TimeLine({ setTimelineDescript }) {
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [mockData, setMockData] = useState({});
  const [eventDescription, setEventDescription] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const events = mockData && Object.keys(mockData).sort();
  const [data, setData] = useState([]);
  const { algorithm, score, asofdate, asof } = useSelector(
    (state: RootState) => ({
      algorithm: state.filters?.filterObject?.algorithm,
      score: state?.filters?.filterObject?.filterByScore,
      asofdate: state.filters?.filterObject?.asofdate,
      asof: state?.filters?.filterObject?.asof,
    })
  );
  useEffect(() => {
    setLoading(true);
    async function apiCall() {
      const data = await getEventLineApi({
        topic_num: router?.query?.camp[0]?.split("-")[0],
        algorithm: algorithm,
      });

      if (data && Object.keys(data).length == 1) {
        let a = new Date().getTime() / 1000;
        data[`asoftime_${Math.round(a)}`] = {
          ...data[Object.keys(data)[0]],
          firstEvent: true,
        };
      } else if (data && Object.keys(data).length > 1 && asof == "bydate") {
        let sortMockData = Object.keys(data).sort();
        let i = 0;
        for (i; i < Object.keys(data).length; i++) {
          if (
            JSON.stringify(asofdate) ==
            JSON.stringify(sortMockData[i]?.split("_")[1])
          ) {
            setIteration(i);
            break;
          }
        }
      }
      data && setMockData(data);
    }

    apiCall();

    setLoading(false);
  }, [algorithm]);

  useEffect(() => {
    setData(
      mockData[
        Object.keys(mockData)?.sort()[iteration]
      ]?.payload_response?.filter((item) => item.score >= score)
    );
  }, [mockData, score, isPlaying]);

  useInterval(() => {
    if (start && events.length > iteration) {
      setData(
        mockData[events[iteration]].payload_response?.filter(
          (item) => item.score >= score
        )
      );
      setEventDescription(mockData[events[iteration]].event?.message);
      // if(isPlaying){
      setIteration(iteration + 1);
      // }
    }
  }, animationSpeed);

  const handleEventSelection = (index) => {
    setData(
      mockData[events[index]].payload_response?.filter(
        (item) => item.score >= score
      )
    );
    setEventDescription(mockData[events[index]].event?.message);
    setIteration(index);
  };

  const handleForwardOrBackord = (iteration) => {
    setData(
      mockData[events[iteration]].payload_response?.filter(
        (item) => item.score >= score
      )
    );
    setEventDescription(mockData[events[iteration]].event?.message);
  };
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
      <div className="evenline-bars">
        {loading || !data ? (
          <CustomSkelton
            skeltonFor="tree"
            bodyCount={4}
            isButton={false}
            stylingClass=""
          />
        ) : data?.length > 0 ? (
          <>
            <RacingBarChart data={data} />
          </>
        ) : (
          <h1>No Event Found!</h1>
        )}
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
