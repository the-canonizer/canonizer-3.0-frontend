import React, { useRef, useEffect } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";
import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  //Manage X axis

  const manageXAxis = (entry) => {
    return entry.level * 30;
  };

  const manageBarXAxis = (entry) => {
   const length = document.getElementById(entry.camp_id).getComputedTextLength();
   console.log(entry.title , 'width' , length)
   return length + entry.level * 30 + 30;
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
      .domain([0, max(data, (entry) => entry.score)]) // [0, 65 (example)]
      .range([0, 900]); // [0, 400 (example)]
    // console.log("yScale", yScale);
    // console.log("xScale", xScale);

    // draw the Title labels
    svg
      .selectAll(".label")
      .data(data, (entry, index) => entry.title)
      .join((enter) =>
        enter
          .append("text")
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
      )
      // .attr("fill", (entry) => '#f89d15')
      .text((entry) => ` ${entry.title} `) 
      .attr("class", "label")
      .attr("id", (entry)=> entry.camp_id)
      .attr("x", (entry) => manageXAxis(entry) + 10)
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

  

    // draw the bars
    svg
      .selectAll(".bar")
      .data(data, (entry, index) => entry.title)
      .join((enter) =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      .attr("fill", (entry) => '#f89d15')
      .attr("class", "bar")
      .attr("x", (entry) =>   manageBarXAxis(entry))
      .attr("height", yScale.bandwidth())
      .transition()
      .attr("width", (entry) => xScale(entry.score) + 25)
      .attr("y", (entry, index) => yScale(index));

        // draw the Score labels
        svg
        .selectAll(".label1")
        .data(data, (entry, index) => entry.title)
        .join((enter) =>
          enter
            .append("text")
            .attr(
              "y",
              (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
            )
        )
        .attr("fill", (entry) => '#fff')
        .text((entry) => ` ${entry.score}`)
        .attr("class", "label")
        .attr("x", (entry) => manageBarXAxis(entry) + 7)
        .transition()
        .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg height={data.length * 30} ref={svgRef}></svg>
    </div>
  );
}

export default RacingBarChart;
