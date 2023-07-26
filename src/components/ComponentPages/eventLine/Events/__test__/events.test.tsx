import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import Events from "..";
import { Provider } from "react-redux";
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
describe("Should render Addnews", () => {
  it("Render without crash", async () => {
    const { container } = render(
      <Provider store={store}>
        <Events
          timelineDescript={[
            {
              eventDate: 1672934400,
              url: "/some-url",
              message: "latest timeline created",
            },
          ]}
        />
      </Provider>
    );
    const titleElement = screen.getByText("Events");
    expect(titleElement).toBeInTheDocument();
    // const h4Element = screen.getByText("latest timeline created");
    // expect(h4Element).toBeInTheDocument();
    // expect(h4Element.tagName).toBe("H4");
  });
});
