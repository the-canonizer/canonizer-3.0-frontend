import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import TopicsList from "../index";
import { store } from "src/store";

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

describe("TopicsList", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <TopicsList />
      </Provider>
    );
  });

  test("renders select canon title", () => {
    const selectCanonTitle = screen.getByText("Select Canon");
    expect(selectCanonTitle).toBeInTheDocument();
  });
});
