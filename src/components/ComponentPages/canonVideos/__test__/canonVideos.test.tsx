import { Fragment } from "react";
import { cleanup, render, screen } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

import CanonVideos from "../";
import { store } from "src/store";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

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

afterEach(cleanup);

describe("Canonizer Videos", () => {
  beforeEach(() => {
    jest.mock("src/network/api/userApi", () => ({
      socialLoginLinkUser: jest.fn(() => Promise.resolve({ status_code: 200 })),
      socialLoginCallback: jest.fn(() => Promise.resolve({ status_code: 200 })),
    }));
  });

  it("render heading and labels", () => {
    render(
      <Fragment>
        <Provider store={store}>
          <RouterContext.Provider value={createMockRouter({ asPath: "" })}>
            <CanonVideos />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const mainHeadig = screen.getByRole("heading", {
      name: /Consciousness: Not a Hard Problem, Just a Color Problem/i,
    });
    const topictab = screen.getByText(/Video Format:/i);

    expect(mainHeadig).toBeInTheDocument();
    expect(topictab).toBeInTheDocument();
  });
});
