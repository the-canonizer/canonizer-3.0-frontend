import CampTree from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import React from "react";

afterEach(cleanup);

describe("Camp tree on camp details page", () => {
  it("Should render without crash", () => {
    const refMock = { current: null }; // Mock the ref object

    render(
      <Provider store={store}>
        <CampTree prevTreeValueRef={refMock} />
      </Provider>
    );
  });
});
