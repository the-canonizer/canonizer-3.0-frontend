import { render, screen } from "../../../utils/testUtils";

import ArchivedCampCheckBox from ".";

describe("Compare Statement page", () => {
  it("should render without crash", () => {
    render(<ArchivedCampCheckBox />);

    expect(screen.getByText("Show archived camps")).toBeInTheDocument();
  });
});
