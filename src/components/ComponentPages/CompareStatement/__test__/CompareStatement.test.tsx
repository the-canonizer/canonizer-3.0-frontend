import { render, screen } from "src/utils/testUtils";

import Statements from "../";
import CompareStatementUI from "../";

describe("Compare Statements page", () => {
  it("should render without crash", () => {
    render(<Statements />);

    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();
  });
});

describe("Compare Statement page", () => {
  it("should render without crash", () => {
    const { container } = render(<CompareStatementUI />);
    expect(container.getElementsByClassName("ant-typography")).toBeTruthy();
    expect(screen.queryByTestId("Camp archive:")).toBeNull();
  });
});
