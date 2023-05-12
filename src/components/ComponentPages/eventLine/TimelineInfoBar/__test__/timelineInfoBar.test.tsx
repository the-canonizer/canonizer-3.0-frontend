import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import NewsAdd from "../index";
function createMockRouter() {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
  };
}

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
  beforeEach(() => {
    jest.mock("../../../../../network/api/campNewsApi", () => ({
      addNewsFeedApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
    }));
  });
  it("Render without crash", async () => {
    const { container } = await render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <NewsAdd />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /Create News/i,
      });
      const cancelButton = screen.getByRole("button", {
        name: /Cancel/i,
      });

      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(container.getElementsByTagName("textarea")).toHaveLength(1);
      expect(container.getElementsByTagName("input")).toHaveLength(3);
      expect(screen.getByText(/display text/i).textContent).toBe(
        "Display Text * (Limit 256 chars)"
      );

      expect(submitButton.textContent).toBe(" Create News");
      expect(cancelButton.textContent).toBe("Cancel");
    });
  });
});
