import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";
import useResizeObserver from "./useResizeObserver";

import styles from "./timeline.module.scss";
import { Card } from "antd";

function RacingBarChart({ data }: any) {
  const linesData = [];

  for (let i = 0; i < data?.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (data[i].level > data[j].level) {
        break;
      }
      if (
        data[i].level === data[j].level &&
        data[i].level < data[i + 1].level
      ) {
        linesData.push({ x1: i, x2: j, level: data[i].level });
        break;
      }
    }
  }

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [widthBar, setWidthBar] = useState(489);

  //Manage X axis

  const manageXAxis = (entry) => {
    return entry.level * 30;
  };

  const manageBarXAxis = (entry) => {
    const element = document.getElementById(entry.camp_id);

    if (element instanceof SVGTextElement) {
      const length = element.getComputedTextLength();
      return entry.level * 30 + 30 + length;
    } else {
      // console.warn("Element is not an SVG text element");
      return /* handle other cases or return a default value */;
    }
  };

  useEffect(() => {
    setWidthBar(489);
  }, [data]);

  // will be called initially and on every data change
  useLayoutEffect(() => {
    const svg = select(svgRef.current);
    // d3.select("element").remove()
    svg?.selectAll("line").remove();
    svg?.selectAll("image").remove();
    svg?.selectAll("text").remove();
    // svg.selectAll('rect').remove()

    if (!dimensions) return;

    // sorting the data
    // data.sort((a, b) => b.value - a.value);

    // const linkGenerator = linkHorizontal();
    // .x(link => link.y)
    // .y(link => link.x);

    const yScale = scaleBand()
      ?.paddingInner(0.1)
      ?.domain(data?.map((value, index) => index)) // [0,1,2,3,4,5]
      ?.range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear()
      ?.domain([0, max(data, (entry) => entry.score)]) // [0, 65 (example)]
      ?.range([0, 900]); // [0, 400 (example)]

    // Add minus square icon
    svg
      ?.selectAll(".icon")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) =>
        enter
          .append("image")
          .attr("class", "circle")
          // .attr("href", (entry) => entry.level == 2 || entry.level == 3 ? "/images/minus-square.svg" : '')
          .attr("href", (entry, index) =>
            index === 0 ||
            (index == data?.length - 1 &&
              data[index].level < data[index - 1].level) ||
            (index > 0 &&
              index < data?.length - 1 &&
              (data[index].level < data[+index + 1].level ||
                data[index].level < data[+index - 1].level))
              ? "/images/circle-icon.svg"
              : null
          )
          .attr("height", 14)
          .attr("width", 14)
      )
      .text((entry) => ` ${entry.title} `)
      .attr("class", "icon")
      .attr("x", (entry) => manageXAxis(entry) - 10)
      // .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 - 8);

    // draw the Title labels
    svg
      ?.selectAll(".label")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) =>
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
      .attr("id", (entry) => entry.camp_id)
      .attr("x", (entry) => manageXAxis(entry) + 10)
      .style("fill", "#242B37") // Set text color
      .style("font-family", "Inter") // Set font family
      .style("font-size", "1rem") // Set font size
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

    // draw the bars
    svg
      ?.selectAll(".bar")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      .attr("fill", () => "#f89d15")
      .attr("class", "bar")
      .attr("x", (entry) => manageBarXAxis(entry))
      .attr("height", yScale.bandwidth())
      .attr("rx", 6)
      .attr("ry", 6)
      .transition()
      .attr("width", (entry) => {
        const length = manageBarXAxis(entry);
        if (widthBar < xScale(entry.score) + length) {
          setWidthBar(xScale(entry.score) + length);
        }
        return xScale(entry.score) + 65;
      })
      .attr("y", (entry, index) => yScale(index));

    // draw the Score labels
    svg
      ?.selectAll(".label1")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) => {
        const group = enter.append("g");
        // Append the icon
        group
          .append("image")
          .attr("xlink:href", "/images/hand-icon.svg") // Replace with the actual path to your icon
          .attr("width", 12) // Adjust the size of the icon as needed
          .attr("height", 12)
          .attr("x", (entry) => manageBarXAxis(entry) + 7) // Adjust position before the text
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 - 6 // Center the icon vertically
          );

        // Append the text
        group
          .append("text")
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
          .attr("fill", "#fff")
          .text((entry) => `  ${entry.score.toFixed(2)}`)
          .attr("class", "label")
          .attr("x", (entry) => manageBarXAxis(entry) + 25);

        return group;
      })
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

    // Draw lines
    let count = 0;
    for (let i = 0; i < linesData?.length; i++) {
      count = count + 0.001;
      svg
        ?.selectAll(`.line${i}`)
        ?.data(linesData)
        ?.join((enter) =>
          enter
            .append("line")
            .style("stroke", "#d9d9d9")
            .style("stroke-width", 2.1)
            .attr("x1", linesData[i].level * 30 + count - 2)
            .attr("y1", linesData[i].x1 * 30 + 23)
            .attr("x2", linesData[i].level * 30 + count - 2)
            .attr(
              "y2",
              linesData[i].x1 * 30 +
                (linesData[i].x2 - linesData[i].x1) * 30 +
                5
            )
        )
        // .text((entry) => ` ${entry.title} `)
        .attr("class", "line");
      // .attr("x", (entry) => manageXAxis(entry) + 20)
      // .transition()
      // .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dimensions]);

  return (
    <Card title="Consensus tree progression" className="tree-progression-card">
      <div
        className={styles.svgD3}
        ref={wrapperRef}
        style={{ marginBottom: "2rem", width: widthBar + 45 }}
      >
        <svg height={data?.length * 30} ref={svgRef}></svg>
      </div>
    </Card>
  );
}

export default RacingBarChart;
