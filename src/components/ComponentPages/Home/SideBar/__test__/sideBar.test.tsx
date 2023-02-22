import HomeSideBar from "../";

import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

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
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <HomeSideBar />
        </RouterContext.Provider>
      </Provider>
    );
  });
});
