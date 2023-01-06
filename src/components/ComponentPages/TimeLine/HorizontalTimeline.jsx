import { Component, useState } from "react";
import HorizontalTimeline from "react-horizontal-timeline";

/*
Format: YYYY-MM-DD
Note: Make sure dates are sorted in increasing order
*/
const VALUES = [
  "2008-06-01",
  "2010-06-01",
  "2013-06-01",
  "2015-03-01",
  "2019-01-01",
  "2019-06-17",
  "2019-08-01",
];

const HorizontalTimelineComp = ({ iteration, handleEventSelection }) => {
  const [value, setValue] = useState(0);
  const [previous, setPrevious] = useState(0);

  return (
    <div>
      {/* Bounding box for the Timeline */}
      <div style={{ width: "60%", height: "100px", margin: "0 auto" }}>
        <HorizontalTimeline
          // index={this.state.value}
          index={iteration}
          indexClick={(index) => {
            // setValue(index);
            handleEventSelection(index);
            // setPrevious(value);
          }}
          values={VALUES}
        />
      </div>
      <div className="text-center">
        {/* any arbitrary component can go here */}
        {/* {iteration} */}
      </div>
    </div>
  );
};

export default HorizontalTimelineComp;
