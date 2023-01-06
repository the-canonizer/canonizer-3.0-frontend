import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart.js";
import useInterval from "./useInterval";
// import "./App.css";
import HorizontalTimelineComp from "./HorizontalTimeline";
const getRandomIndex = (array) => {
  return Math.floor(array.length * Math.random());
};

function TimeLine() {
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState([
    {
      name: "alpha",
      value: 10,
      color: "#f4efd3",
      level: 1,
    },
    {
      name: "beta 1",
      value: 15,
      color: "#cccccc",
      level: 2,
    },
    {
      name: "charlie",
      value: 20,
      color: "#c2b0c9",
      level: 3,
    },
    {
      name: "delta",
      value: 25,
      color: "#9656a1",
      level: 3,
    },
    {
      name: "echo",
      value: 30,
      color: "#fa697c",
      level: 1,
    },
    {
      name: "foxtrot",
      value: 35,
      color: "#fcc169",
      level: 2,
    },
  ]);

  const mockData = {
    1: [
      {
        name: "alpha",
        value: 10,
        color: "#f4efd3",
        level: 1,
      },
      {
        name: "beta 2",
        value: 15,
        color: "#cccccc",
        level: 2,
      },
      {
        name: "charlie",
        value: 20,
        color: "#c2b0c9",
        level: 3,
      },
      {
        name: "delta",
        value: 25,
        color: "#9656a1",
        level: 3,
      },
      {
        name: "echo",
        value: 30,
        color: "#fa697c",
        level: 1,
      },
      {
        name: "foxtrot",
        value: 35,
        color: "#fcc169",
        level: 2,
      },
    ],
    2: [
      {
        name: "alpha",
        value: 35,
        color: "#f4efd3",
        level: 1,
      },
      {
        name: "beta 3",
        value: 15,
        color: "#cccccc",
        level: 2,
      },
      {
        name: "charlie",
        value: 20,
        color: "#c2b0c9",
        level: 3,
      },
      {
        name: "delta",
        value: 25,
        color: "#9656a1",
        level: 3,
      },
      {
        name: "test1",
        value: 25,
        color: "#9656a1",
        level: 3,
      },
      {
        name: "echo",
        value: 30,
        color: "#fa697c",
        level: 1,
      },
      {
        name: "foxtrot",
        value: 10,
        color: "#fcc169",
        level: 2,
      },
      {
        name: "test2",
        value: 25,
        color: "#9656a1",
        level: 2,
      },
    ],
    3: [
      {
        name: "alpha",
        value: 35,
        color: "#f4efd3",
        level: 1,
      },
      {
        name: "beta 4",
        value: 15,
        color: "#cccccc",
        level: 2,
      },
      {
        name: "charlie",
        value: 20,
        color: "#c2b0c9",
        level: 3,
      },
      {
        name: "test1",
        value: 25,
        color: "#9656a1",
        level: 4,
      },
      {
        name: "delta",
        value: 25,
        color: "#9656a1",
        level: 3,
      },

      {
        name: "echo",
        value: 30,
        color: "#fa697c",
        level: 1,
      },
      {
        name: "foxtrot",
        value: 10,
        color: "#fcc169",
        level: 2,
      },
      {
        name: "test2",
        value: 25,
        color: "#9656a1",
        level: 2,
      },
    ],
  };

  const events = Object.keys(mockData);

  let iterationCount = 0;

  useInterval(() => {
    if (start && events.length > iteration) {
      // const randomIndex = getRandomIndex(data);
      // setData(
      //   data.map((entry, index) =>
      //     index === randomIndex
      //       ? {
      //           ...entry,
      //           value: entry.value + 10,
      //         }
      //       : entry
      //   )
      // );
      setData(mockData[events[iteration]]);
      console.log(data);
      setIteration(iteration + 1);
      iterationCount++;
    }
  }, 1000);

  const handleEventSelection = (index) => {
    setData(mockData[events[index]]);
    setIteration(index);
    setStart(false);
  };

  const handleStart = () => {
    if (start) {
      setStart(false);
    }
  };

  return (
    <React.Fragment>
      <h1>Racing Bar Chart</h1>
      <RacingBarChart data={data} />
      <HorizontalTimelineComp
        iteration={iteration}
        handleEventSelection={handleEventSelection}
      />
      <button onClick={() => setStart(!start)}>
        {start ? "Stop the race" : "Start the race!"}
      </button>
      {iteration > 0 && (
        <button
          onClick={() => {
            setStart(!start);
            setIteration(0);
          }}
        >
          Reset
        </button>
      )}
      <p>Iteration: {iteration}</p>
    </React.Fragment>
  );
}

export default TimeLine;
