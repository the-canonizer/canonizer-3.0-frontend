import CreateTopic from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store";
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

describe("Sidebar Filters Component", () => {
  it("Should render without crash", () => {
    const { container, getByText } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );

    expect(container.getElementsByTagName("button")).toHaveLength(1);
    expect(getByText("Create New Topic")).toBeInTheDocument();
    expect(getByText("Canonizer Algorithm:")).toBeInTheDocument();
    // expect(getByText("Algorithm Information")).toBeInTheDocument();
  });
});
