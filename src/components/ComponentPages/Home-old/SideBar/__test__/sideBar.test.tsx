import HomeSideBar from "../";

import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

function createMockRouter(): NextRouter {
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

afterEach(cleanup);

describe("HomePage Sidebar Component", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <HomeSideBar />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/filter/i)).toBeInTheDocument();

    expect(screen.getByText(/show archived camps/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(8);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
  });
});
