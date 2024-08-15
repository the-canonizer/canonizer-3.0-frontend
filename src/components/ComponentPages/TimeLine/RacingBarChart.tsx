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
              ? "/images/minus-square.svg"
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
      .transition()
      .attr("width", (entry) => {
        const length = manageBarXAxis(entry);
        if (widthBar < xScale(entry.score) + length) {
          setWidthBar(xScale(entry.score) + length);
        }
        return xScale(entry.score) + 39;
      })
      .attr("y", (entry, index) => yScale(index));

    // draw the Score labels
    const svgIcon = `
  <svg width="10" height="13" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.1522 5.2133C9.8674 5.21302 9.58615 5.27647 9.32905 5.39899V3.01823C9.32915 2.68533 9.24269 2.35812 9.07816 2.06872C8.91364 1.77931 8.6767 1.53765 8.39059 1.36746C8.10448 1.19726 7.77905 1.10437 7.44621 1.09791C7.11337 1.09144 6.78457 1.17162 6.49207 1.33058C6.35149 0.895086 6.06003 0.524102 5.67019 0.284444C5.28035 0.0447849 4.81774 -0.047797 4.36569 0.023373C3.91365 0.094543 3.50186 0.324787 3.20452 0.672636C2.90717 1.02048 2.7438 1.46308 2.74384 1.92069V2.38077C2.45113 2.24174 2.12799 2.17905 1.80452 2.19856C1.48106 2.21806 1.16779 2.31911 0.893901 2.49229C0.620011 2.66548 0.394408 2.90517 0.238109 3.18904C0.0818086 3.4729 -0.000104252 3.79171 9.95772e-08 4.11576V9.87782C9.95772e-08 11.4788 0.635981 13.0142 1.76803 14.1462C2.90009 15.2783 4.43548 15.9143 6.03645 15.9143C7.63741 15.9143 9.1728 15.2783 10.3049 14.1462C11.4369 13.0142 12.0729 11.4788 12.0729 9.87782V7.13399C12.0723 6.62476 11.8698 6.13656 11.5097 5.77649C11.1496 5.41641 10.6614 5.21387 10.1522 5.2133ZM10.9754 9.87782C10.9754 11.1877 10.455 12.4439 9.52878 13.3702C8.60256 14.2964 7.34633 14.8167 6.03645 14.8167C4.72656 14.8167 3.47033 14.2964 2.54411 13.3702C1.61788 12.4439 1.09754 11.1877 1.09754 9.87782V4.11576C1.09754 3.89745 1.18426 3.68808 1.33863 3.53371C1.493 3.37934 1.70237 3.29261 1.92069 3.29261C2.139 3.29261 2.34837 3.37934 2.50274 3.53371C2.65711 3.68808 2.74384 3.89745 2.74384 4.11576V7.13399C2.74384 7.27953 2.80166 7.41911 2.90457 7.52202C3.00748 7.62494 3.14706 7.68275 3.29261 7.68275C3.43815 7.68275 3.57773 7.62494 3.68064 7.52202C3.78356 7.41911 3.84137 7.27953 3.84137 7.13399V1.92069C3.84137 1.70238 3.9281 1.49301 4.08247 1.33864C4.23684 1.18427 4.44621 1.09754 4.66453 1.09754C4.88284 1.09754 5.09221 1.18427 5.24658 1.33864C5.40095 1.49301 5.48768 1.70238 5.48768 1.92069V6.58522C5.48768 6.73076 5.54549 6.87034 5.64841 6.97326C5.75132 7.07617 5.8909 7.13399 6.03645 7.13399C6.18199 7.13399 6.32157 7.07617 6.42448 6.97326C6.5274 6.87034 6.58521 6.73076 6.58521 6.58522V3.01823C6.58521 2.79992 6.67194 2.59054 6.82631 2.43617C6.98068 2.2818 7.19005 2.19508 7.40836 2.19508C7.62668 2.19508 7.83605 2.2818 7.99042 2.43617C8.14479 2.59054 8.23152 2.79992 8.23152 3.01823V8.00286C7.4647 8.13356 6.76877 8.53111 6.26668 9.12525C5.76459 9.71938 5.48867 10.4719 5.48768 11.2497C5.48768 11.3953 5.54549 11.5349 5.64841 11.6378C5.75132 11.7407 5.8909 11.7985 6.03645 11.7985C6.18199 11.7985 6.32157 11.7407 6.42448 11.6378C6.5274 11.5349 6.58521 11.3953 6.58521 11.2497C6.58587 10.6678 6.81735 10.1098 7.22886 9.69832C7.64038 9.28681 8.19832 9.05533 8.78028 9.05467C8.92583 9.05467 9.06541 8.99685 9.16832 8.89394C9.27123 8.79103 9.32905 8.65145 9.32905 8.50591V7.13399C9.32905 6.91567 9.41578 6.7063 9.57015 6.55193C9.72452 6.39756 9.93389 6.31083 10.1522 6.31083C10.3705 6.31083 10.5799 6.39756 10.7343 6.55193C10.8886 6.7063 10.9754 6.91567 10.9754 7.13399V9.87782Z" fill="#fff"/>
  </svg>`;
    svg
      ?.selectAll(".label1")
      ?.data(data, (entry) => entry.title)
      ?.join((enter) => {
        const g = enter.append("g");

        // Append the SVG icon
        g.append("foreignObject")
          .attr("x", (entry) => manageBarXAxis(entry))
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 - 6
          )
          .attr("width", 12)
          .attr("height", 12)
          .html(svgIcon);

        // Append the text next to the SVG icon
        g.append("text")
          .attr("x", (entry) => manageBarXAxis(entry) + 15)
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
          .attr("fill", "#fff")
          .attr("class", "label-text")
          .style("font-size", "12px")
          .text((entry) => `${entry.score.toFixed(2)} `);

        return g;
      })
      // .transition()
      // .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);

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
