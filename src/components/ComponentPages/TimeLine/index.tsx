import React, { useEffect, useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useInterval from "./useInterval";
// import "./App.css";
import { Empty, Typography } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getEventLineApi } from "src/network/api/topicEventLineAPI";
import { RootState } from "src/store/index.js";
import CustomSkelton from "../../common/customSkelton";
import TimelineSlider from "../eventLine/TimelineSlider";

// const getRandomIndex = (array) => {
//   return Math.floor(array.length * Math.random());
// };

const { Title, Paragraph } = Typography;

function TimeLine({ setTimelineDescript, setLoadingEvents }: any) {
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [mockData, setMockData] = useState({});
  // const [eventDescription, setEventDescription] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [value, setValue] = useState(1);
  const router = useRouter();

  const events = mockData && Object.keys(mockData).sort();
  const [data, setData] = useState([]);
  // const [URL, setURL] = useState("");
  // const [eventId, setEventId] = useState(0);

  const { algorithm, score, asofdate, asof } = useSelector(
    (state: RootState) => ({
      algorithm: state.filters?.filterObject?.algorithm,
      score: state?.filters?.filterObject?.filterByScore,
      asofdate: state.filters?.filterObject?.asofdate,
      asof: state?.filters?.filterObject?.asof,
    })
  );


  useEffect(() => {
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
    setLoading(true);
    setLoadingEvents(true);
    setIteration(0);
    setStart(false);
    setMockData({});
    setIsPlaying(false);

    apiCall();
    setLoadingEvents(false);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  useEffect(() => {
    setData(
      mockData[
        Object.keys(mockData)?.sort()[iteration]
      ]?.payload_response?.filter((item) => item.score >= score)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockData, score, isPlaying]);

  useInterval(() => {
    if (start && events.length > iteration) {
      setData(
        mockData[events[iteration]].payload_response?.filter(
          (item) => item.score >= score
        )
      );
      // setEventDescription(mockData[events[iteration]].event?.message);
      // if(isPlaying){
      setIteration(iteration + 1);
      // }
    }
  }, animationSpeed);

  const handleEventSelection = (index) => {
    setData(
      mockData[events[index]]?.payload_response?.filter(
        (item) => item.score >= score
      )
    );
    // setEventDescription(mockData[events[index]].event?.message);
    setIteration(index);
  };

  const handleForwardOrBackord = (iteration) => {
    setData(
      mockData[events[iteration]].payload_response?.filter(
        (item) => item.score >= score
      )
    );
    // setEventDescription(mockData[events[iteration]].event?.message);
  };


  return (
    <React.Fragment>
      {loading || !data ? (
        <CustomSkelton
          skeltonFor="playButtons"
          bodyCount={4}
          isButton={false}
          stylingClass=""
        />
      ) : (
        <div className="audio-player">
         
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
            // eventId={eventId}
            // setEventId={setEventId}
            // value={value}
            // setValue={setValue}
          />
        </div>
      )}
      <div className="evenline-bars">
        {loading || !data ? (
          <CustomSkelton
            skeltonFor="tree"
            bodyCount={4}
            isButton={false}
            stylingClass=""
          />
        ) : data?.length > 0 ? (
          <RacingBarChart data={data} />
        ) : (
          // <h1>No Event Found!</h1>
          <Empty description="No Event Found!" />
        )}
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
