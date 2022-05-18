import RecentActivities from "../";
import { cleanup, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { windowMatchMedia } from "../../../../../utils/testUtils";

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
windowMatchMedia();

describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", () => {
    act(() => {
      const { container } = render(
        <RouterContext.Provider value={createMockRouter()}>
          <RecentActivities />
        </RouterContext.Provider>
      );
    });
  });
});
