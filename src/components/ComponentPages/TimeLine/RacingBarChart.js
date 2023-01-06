import React, { useRef, useEffect } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";
import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  //Manage X axis

  const manageXAxis = (level) => {
    return level * 10;
  };

  const pickColor = (level) => {
    if (level === 1) {
      return "#f4efd3";
    } else if (level === 2) {
      return "#cccccc";
    } else if (level === 3) {
      return "#c2b0c9";
    } else if (level === 4) {
      return "#fcc169";
    }
  };

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // sorting the data
    // data.sort((a, b) => b.value - a.value);

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data?.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear()
      .domain([0, max(data, (entry) => entry.value)]) // [0, 65 (example)]
      .range([0, dimensions.width]); // [0, 400 (example)]
    console.log("yScale", yScale);
    console.log("xScale", xScale);
    // draw the bars
    svg
      .selectAll(".bar")
      .data(data, (entry, index) => entry.name)
      .join((enter) =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      .attr("fill", (entry) => pickColor(entry.level))
      .attr("class", "bar")
      .attr("x", (entry) => manageXAxis(entry.level))
      .attr("height", yScale.bandwidth())
      .transition()
      .attr("width", (entry) => xScale(entry.value))
      .attr("y", (entry, index) => yScale(index));

    // draw the labels
    svg
      .selectAll(".label")
      .data(data, (entry, index) => entry.name)
      .join((enter) =>
        enter
          .append("text")
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
      )
      .text((entry) => `🐎 ... ${entry.name} (${entry.value} meters)`)
      .attr("class", "label")
      .attr("x", (entry) => manageXAxis(entry.level) + 10)
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default RacingBarChart;
