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
  "2020-08-01",
  "2021-08-01",
];

const HorizontalTimelineComp = ({
  iteration,
  handleEventSelection,
  eventDescription,
  events,
}) => {
  let eventTimes = [];
  (function () {
    for (let i = 0; i < events.length; i++) {
      const date = new Date(events[i] * 1000);
      eventTimes[i] = `${date.getFullYear()}-${
        date.getMonth() ? date.getMonth() : 1
      }-${date.getDate()} `;
    }
  })();
  return (
    <div>
      {/* Bounding box for the Timeline */}
      <div className="text-center">{eventDescription}</div>
      <div style={{ width: "60%", height: "100px", margin: "0 auto" }}>
        <HorizontalTimeline
          index={iteration}
          indexClick={(index) => {
            handleEventSelection(index);
          }}
          values={eventTimes}
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
