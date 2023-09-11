import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "src/store";

import HotTopic from "../";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

afterEach(cleanup);

// Mock the API functions used in the component
jest.mock("src/network/api/topicAPI", () => ({
  GetHotTopicDetails: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
}));

describe("AddOrManage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/topicAPI", () => ({
      GetHotTopicDetails: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: [] })
      ),
    }));
  });

  test("Render Hot topic", () => {
    render(
      <Provider store={store}>
        <HotTopic />
      </Provider>
    );

    expect(screen.getByText("Hot Topic")).toBeInTheDocument();
  });
});
