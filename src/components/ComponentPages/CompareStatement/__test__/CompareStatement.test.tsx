import { render, screen } from "src/utils/testUtils";
// import { useRouter } from "next/router";
// import { getCompareStatement } from "src/network/api/history";

import Statements from "../";
import CompareStatementUI from "../";

// const useRouter = jest.fn();

// export { useRouter };

// jest.mock("next/router", () => ({
//   __esModule: true,
//   useRouter() {
//     return {
//       route: "/",
//       pathname: "",
//       query: {
//         routes: ["88-theories", "1-Agreement"],
//         statements: '1_1',
//         status: 'live_live',
//         from: "statement",
//       },
//       asPath: "",
//       push: jest.fn(),
//       events: {
//         on: jest.fn(),
//         off: jest.fn(),
//       },
//       beforePopState: jest.fn(() => null),
//       prefetch: jest.fn(() => null),
//     };
//   },
// }));

// jest.mock(
//   "next/link",
//   () =>
//     ({ children }: any) =>
//       children
// );

// jest.mock("src/network/api/history");

describe("Compare Statement page", () => {
  // beforeEach(() => {
  //   // useRouter.mockReset();
  //   getCompareStatement.mockReset();
  // });
  it("should render without crash", () => {
    render(<Statements />);

    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();
    // expect(screen.getByText("Create Topic")).toBeInTheDocument();
    // expect(screen.getByText("Create New Camp")).toBeInTheDocument();
  });

  // test("renders CompareStatement component", () => {
  //   // Mock useRouter
  //   const router = {
  //     query: { routes: ["topic-1", "camp-1"], from: "compare" },
  //   };
  //   useRouter.mockReturnValue(router);

  //   render(<Statements />);

  //   // Assert loading state
  //   const loadingIndicator = screen.getByTestId("loading-indicator");
  //   expect(loadingIndicator).toBeInTheDocument();

  //   // Assert that getCompareStatement is called with the correct parameters
  //   expect(getCompareStatement).toHaveBeenCalledWith({
  //     ids: undefined,
  //     topic_num: 1,
  //     camp_num: 1,
  //     compare: "compare",
  //   });
  // });

  // test("renders CompareStatement component with statements and live statement", () => {
  //   // Mock useRouter
  //   const router = {
  //     query: { routes: ["topic-1", "camp-1"], from: "compare" },
  //   };
  //   useRouter.mockReturnValue(router);

  //   // Mock getCompareStatement response
  //   const mockStatements = [
  //     { parsed_value: "Statement 1" },
  //     { parsed_value: "Statement 2" },
  //   ];
  //   const mockLiveStatement = { parsed_value: "Live Statement" };
  //   getCompareStatement.mockResolvedValue({
  //     status_code: 200,
  //     data: {
  //       comparison: mockStatements,
  //       liveStatement: mockLiveStatement,
  //     },
  //   });

  //   render(<Statements />);

  //   // Assert loading state
  //   const loadingIndicator = screen.queryByTestId("loading-indicator");
  //   expect(loadingIndicator).not.toBeInTheDocument();

  //   // Assert rendered statements
  //   const statement1 = screen.getByText("Statement 1");
  //   const statement2 = screen.getByText("Statement 2");
  //   expect(statement1).toBeInTheDocument();
  //   expect(statement2).toBeInTheDocument();

  //   // Assert rendered live statement
  //   const liveStatement = screen.getByText("Live Statement");
  //   expect(liveStatement).toBeInTheDocument();

  //   // Assert that getCompareStatement is called with the correct parameters
  //   expect(getCompareStatement).toHaveBeenCalledWith({
  //     ids: undefined,
  //     topic_num: 1,
  //     camp_num: 1,
  //     compare: "compare",
  //   });
  // });

  // test("renders CompareStatement component with error", () => {
  //   // Mock useRouter
  //   const router = {
  //     query: { routes: ["topic-1", "camp-1"], from: "compare" },
  //   };
  //   useRouter.mockReturnValue(router);

  //   // Mock getCompareStatement response with error
  //   getCompareStatement.mockResolvedValue({
  //     status_code: 500,
  //     error: "Internal Server Error",
  //   });

  //   render(<Statements />);

  //   // Assert loading state
  //   const loadingIndicator = screen.queryByTestId("loading-indicator");
  //   expect(loadingIndicator).not.toBeInTheDocument();

  //   // Assert error message
  //   // const errorMessage = screen.getByText("Failed to fetch statements");
  //   // expect(errorMessage).toBeInTheDocument();

  //   // Assert that getCompareStatement is called with the correct parameters
  //   expect(getCompareStatement).toHaveBeenCalledWith({
  //     ids: undefined,
  //     topic_num: 1,
  //     camp_num: 1,
  //     compare: "compare",
  //   });
  // });
});

describe("Compare Statement page", () => {
  // beforeEach(() => {
  //   useRouter.mockReset();
  //   getCompareStatement.mockReset();
  // });
  it("should render without crash", () => {
    const { container } = render(<CompareStatementUI />);
    expect(container.getElementsByClassName("ant-typography")).toBeTruthy();
    expect(screen.queryByTestId("Camp archive:")).toBeNull();
  });
});
