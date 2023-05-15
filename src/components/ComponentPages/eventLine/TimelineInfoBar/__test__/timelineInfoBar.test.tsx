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
import CampInfoBar from "../index";
import { NextRouter } from "next/router";

function createMockRouter(router: Partial<NextRouter>): NextRouter {
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
    ...router,
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
  it("Render without crash", async () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/eventline/1245-test-event-topic/2-camp-122",
          })}
        >
          <CampInfoBar />
        </RouterContext.Provider>
      </Provider>
    );
    console.log("container ", container);
    const a = screen.getByText(/topic :/i);
    const b = screen.getByRole("button", {
      name: /arrow\-left/i,
    });
  });
});
