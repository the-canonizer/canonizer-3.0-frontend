import React, { useRef, useEffect } from "react";
import { select, scaleBand, scaleLinear, max , linkHorizontal} from "d3";
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

    const linkGenerator = linkHorizontal()
    // .x(link => link.y)
    // .y(link => link.x);


    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data?.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear()
      .domain([0, max(data, (entry) => entry.score)]) // [0, 65 (example)]
      .range([0, 900]); // [0, 400 (example)]
    // console.log("yScale", yScale);
    // console.log("xScale", xScale);


    // var today = new Date();
    // svg.append("line")
    // .attr("x1", today)  //<<== change your code here
    // .attr("y1", 0)
    // .attr("x2", today)  //<<== and here
    // .attr("y2", 40)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("fill", "none");

    


    // Add minus square icon
    svg
    .selectAll(".icon")
      .data(data, (entry, index) => entry.title)
      .join((enter) =>
      enter
      .append("image")
      .attr("class", "circle")
      // .attr("href", (entry) => entry.level == 2 || entry.level == 3 ? "/images/minus-square.svg" : '')
      .attr("href", (entry) =>  "/images/minus-square.svg" )
      .attr("height", 14)
      .attr("width", 14)
    )
    .text((entry) => ` ${entry.title} `) 
      .attr("class", "icon")
      .attr("x", (entry) => manageXAxis(entry) - 10 )
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 - 8);

  

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
      .attr("width", (entry) => xScale(entry.score) + 39)
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
        .text((entry) => ` ${entry.score.toFixed(2)}`)
        .attr("class", "label")
        .attr("x", (entry) => manageBarXAxis(entry) + 7)
        .transition()
        .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

        // Lines Data

        const linesData = [
          { x1: 1, x2: 27, level: 2 },
          { x1: 2, x2: 20, level: 3 },
          { x1: 3, x2: 16, level: 4 },
          { x1: 4, x2: 10, level: 5 },
          { x1: 5, x2: 9, level: 6 },
          { x1: 10, x2: 13, level: 5 },
          { x1: 16, x2: 19, level: 4 },
          { x1: 20, x2: 23, level: 3 },
          { x1: 23, x2: 25, level: 3 },
          { x1: 27, x2: 30, level: 2 },
          { x1: 33, x2: 35, level: 2 }
        ]

        // Draw lines 
        let count = 0
        for(let i=0; i<linesData.length; i++){
          count = count + .001
          svg
          .selectAll(`.line${i}`)
            .data(data, (entry, index) => null)
            .join((enter) =>
            enter
            .append('line')
      .style("stroke", "lightgreen")
      .style("stroke-width", 2)
      .attr("x1",    linesData[i].level * 30 +  count - 2)
      .attr("y1", linesData[i].x1 * 30 + 23 )
      .attr("x2", linesData[i].level * 30 + count - 2)
      .attr("y2",  linesData[i].x1 * 30 + (linesData[i].x2 - linesData[i].x1) * 30 + 5 )
          )
          // .text((entry) => ` ${entry.title} `) 
          .attr("class", "line")
          // .attr("x", (entry) => manageXAxis(entry) + 20)
          .transition()
          // .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
        }

    //     svg
    //     .selectAll(".line1")
    //       .data(data, (entry, index) => index)
    //       .join((enter) =>
    //       enter
    //       .append('line')
    // .style("stroke", "lightgreen")
    // .style("stroke-width", 2)
    // .attr("x1",  87)
    // .attr("y1", 50)
    // .attr("x2", 87)
    // .attr("y2", 638)
    //     )
    //     // .text((entry) => ` ${entry.title} `) 
    //     .attr("class", "line")
    //     // .attr("x", (entry) => manageXAxis(entry) + 20)
    //     .transition()
    //     // .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
    //   // }

  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg height={data.length * 30} ref={svgRef}></svg>
    </div>
  );
}

export default RacingBarChart;
