import { render, screen } from "../../../../utils/testUtils";

import Statements from "../";

describe("Compare Statement page", () => {
  it("should render without crash", () => {
    render(<Statements />);

    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();
    expect(screen.getByText("Create New Topic")).toBeInTheDocument();
    expect(screen.getByText("Create New Camp")).toBeInTheDocument();
  });
});
