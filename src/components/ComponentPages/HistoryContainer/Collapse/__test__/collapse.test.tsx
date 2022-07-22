import HistoryCollapse from "..";

import { render, cleanup, screen } from "@testing-library/react";

afterEach(cleanup);

describe("CampHistory Page", () => {
  it("should render without crash", () => {
    const { container } = render(<HistoryCollapse />);
  });
});
