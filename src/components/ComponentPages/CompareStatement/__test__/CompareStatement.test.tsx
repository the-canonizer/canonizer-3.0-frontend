import { render, screen } from "../../../../utils/testUtils";

import Statements from "../";
import CompareStatementUI from "../";

const statements = []
const isLoading  = false
const liveStatement = {}
const itemsStatus   = {}
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

describe("Compare Statement page", () => {
  it("should render without crash", () => {
    const {container}=render(<CompareStatementUI
      statements={statements}
      isLoading={isLoading}
      liveStatement={liveStatement}
      itemsStatus={itemsStatus}
      />);
  expect( container.getElementsByClassName("ant-typography")
    ).toBeTruthy()
  expect(screen.queryByTestId("Camp archive:")).toBeNull();

  });
});
