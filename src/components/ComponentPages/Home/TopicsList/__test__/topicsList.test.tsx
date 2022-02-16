import React from "react";
import { render, cleanup } from "@testing-library/react";
import TopicsList from "../";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

describe("TopicsList Component", function () {
  it("should have hello world message", function () {
    // let { getByText } = render(
    //   <Provider store={store}>
    //     <TopicsList />
    //   </Provider>
    // );
    // expect(getByText("Canonized list for")).toMatchInlineSnapshot(`
    //   <h3>
    //   Canonized list for
    //   </h3>
    // `);
  });
});
