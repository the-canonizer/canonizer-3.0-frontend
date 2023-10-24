// import { select, scaleBand, scaleLinear, max, linkHorizontal } from "d3";

import React from "react";
import { render } from "@testing-library/react";
import RacingBarChart from "../RacingBarChart";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  select: jest.fn(),
}));

describe("RacingBarChart", () => {
  it("renders without errors", () => {
    const { container } = render(<RacingBarChart data={[]} />);
    // Add assertions as needed
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
  });

  // Add more test cases for different scenarios

  // For example, test the component with data and check if it renders correctly
  it("renders with data", () => {
    const data = [
      { level: 1, score: 10, title: "Title 1", camp_id: "camp1" },
      { level: 2, score: 20, title: "Title 2", camp_id: "camp2" },
      // Add more data entries as needed
    ];
    const data2 = [
      {
        topic_id: 2,
        level: 1,
        camp_id: 1,
        camp_name: "Agreement",
        title: "God",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 2,
        camp_id: 3,
        camp_name: "Theist",
        title: "Theist",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 3,
        camp_id: 8,
        camp_name: "Jewish",
        title: "Jewish",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 3,
        camp_id: 7,
        camp_name: "Muslim",
        title: "Muslim",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 3,
        camp_id: 6,
        camp_name: "Christian",
        title: "Christian",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 4,
        camp_id: 10,
        camp_name: "LDS",
        title: "LDS",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 5,
        camp_id: 11,
        camp_name: "Ex-Nihilo",
        title: "Ex-Nihilo",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 4,
        camp_id: 9,
        camp_name: "Catholic",
        title: "Catholic",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 2,
        camp_id: 2,
        camp_name: "Atheist",
        title: "Atheist",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 3,
        camp_id: 5,
        camp_name: "Extropian",
        title: "Extropian",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
      {
        topic_id: 2,
        level: 3,
        camp_id: 4,
        camp_name: "Traditional",
        title: "Traditional",
        score: 0,
        full_score: 0,
        submitter_nick_id: 1,
      },
    ];

    const { container } = render(<RacingBarChart data={data2} />);

    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
  });
});
