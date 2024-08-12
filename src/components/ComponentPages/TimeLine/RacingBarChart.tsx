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

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);
  const [widthBar, setWidthBar] = useState(489);

  // Define a fixed bar width
  const fixedBarWidth = 50;

  // Manage X axis
  const manageXAxis = (entry) => {
    return entry.level * 30;
  };

  const manageBarXAxis = (entry) => {
    const element = document.getElementById(entry.camp_id);

    if (element instanceof SVGTextElement) {
      const length = element.getComputedTextLength();
      return entry.level * 30 + 30 + length;
    } else {
      return entry.level * 30 + 30; // Default value
    }
  };

  useEffect(() => {
    setWidthBar(489);
  }, [data]);

  useLayoutEffect(() => {
    const svg = select(svgRef.current);
    svg?.selectAll("line").remove();
    svg?.selectAll("image").remove();
    svg?.selectAll("text").remove();

    if (!dimensions) return;

    const yScale = scaleBand<number>()
      .paddingInner(0.1)
      .domain(data?.map((_, index) => index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear<number>()
      .domain([0, max(data, (entry) => entry.score) || 0]) // [0, max score]
      .range([0, dimensions.width]); // Adjust range as needed

    // Add minus square icon
    svg
      ?.selectAll(".icon")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) =>
        enter
          .append("image")
          .attr("class", "circle")
          .attr("href", (entry, index) =>
            index === 0 ||
            (index === data.length - 1 &&
              data[index].level < data[index - 1].level) ||
            (index > 0 &&
              index < data.length - 1 &&
              (data[index].level < data[index + 1].level ||
                data[index].level < data[index - 1].level))
              ? "/images/minus-square.svg"
              : null
          )
          .attr("height", 14)
          .attr("width", 14)
      )
      .attr("x", (entry) => manageXAxis(entry) - 10)
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 - 8);

    // Draw the Title labels
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
      .text((entry) => ` ${entry.title} `)
      .attr("class", "label")
      .attr("id", (entry) => entry.camp_id)
      .attr("x", (entry) => manageXAxis(entry) + 10)
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

    // Draw the bars with fixed width
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
      .attr("width", fixedBarWidth)
      .transition()
      .attr("x", (entry) => manageBarXAxis(entry))
      .attr("y", (entry, index) => yScale(index));

    // Draw the Score labels
    svg
      ?.selectAll(".label1")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) =>
        enter
          .append("text")
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
      )
      .attr("fill", () => "#fff")
      .text((entry) => ` ${entry.score.toFixed(2)}`)
      .attr("class", "label")
      .attr("x", (entry) => manageBarXAxis(entry) + 7)
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
        .attr("class", "line");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dimensions]);

  return (
    <Card title="Consensus tree progression" className="tree-progression-card">
      <div
        className={styles.svgD3}
        ref={wrapperRef}
        style={{
          marginBottom: "2rem",
          width: Math.max(widthBar, data.length * fixedBarWidth) + 45,
        }}
      >
        <svg height={data?.length * 30} ref={svgRef}></svg>
      </div>
    </Card>
  );
}

export default RacingBarChart;
