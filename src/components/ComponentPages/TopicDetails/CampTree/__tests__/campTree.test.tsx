import CampTree from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import React from "react";

afterEach(cleanup);
import { renderHook } from "@testing-library/react-hooks";

// Create a mock reference object with a current property
const mockRef = { current: null };

// Spy on the useRef hook and return the mock reference object
jest.spyOn(React, "useRef").mockReturnValue(mockRef);

describe("Camp tree on camp details page", () => {
  it("Should render without crash", () => {
    const refMock = { current: null }; // Mock the ref object

    render(
      <Provider store={store}>
        <CampTree prevTreeValueRef={refMock} />
      </Provider>
    );
  });

  test("renders CampTree component correctly", () => {
    render(
      <Provider store={store}>
        <CampTree />
      </Provider>
    );

    expect(screen.getByTestId("camp-tree")).toBeInTheDocument();
    expect(screen.getByText("No Camp Tree Found")).toBeInTheDocument();
  });

  test("expands tree nodes correctly", () => {
    // Create a mock data object with tree nodes to pass as props
    const mockTreeData = {
      1: {
        title: "Node 1",
        children: {
          11: { title: "Node 1.1" },
          12: { title: "Node 1.2" },
        },
      },
    };

    render(
      <Provider store={store}>
        <CampTree tree={mockTreeData} />
      </Provider>
    );
    expect(screen.getByTestId("camp-tree")).toBeInTheDocument();
    expect(screen.getByText("No Camp Tree Found")).toBeInTheDocument();
  });
});
