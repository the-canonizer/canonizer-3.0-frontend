import { render, screen } from "../../../utils/testUtils";

import  ScorePercentageCheckBox from ".";

describe("Compare Statement page", () => {
  it("should render without crash", () => {
    render(<ScorePercentageCheckBox />);

    expect(screen.getByText("Show score in Percentage")).toBeInTheDocument();
  });
});
