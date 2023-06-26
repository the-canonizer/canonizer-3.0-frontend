import { select, scaleBand, scaleLinear, max, linkHorizontal } from "d3";

import React from "react";
import { render } from "@testing-library/react";
import RacingBarChart from "../RacingBarChart";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  select: jest.fn(),
}));

describe("RacingBarChart", () => {
  it("renders without errors", () => {
    render(<RacingBarChart data={[]} />);
    // Add assertions as needed
  });

  // Add more test cases for different scenarios

  // For example, test the component with data and check if it renders correctly
  it("renders with data", () => {
    const data = [
      { level: 1, score: 10, title: "Title 1", camp_id: "camp1" },
      { level: 2, score: 20, title: "Title 2", camp_id: "camp2" },
      // Add more data entries as needed
    ];
    render(<RacingBarChart data={data} />);
    // Add assertions to check if the rendered output is correct based on the provided data
  });
});
