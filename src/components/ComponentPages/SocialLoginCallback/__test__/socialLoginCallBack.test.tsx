import { Fragment } from "react";
import { cleanup, render, screen } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

import SocialLoginCallback from "../";
import { store } from "src/store";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
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
    query: { provider: "", code: "" },
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

describe("Social Login Callback", () => {
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
            <SocialLoginCallback />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });
});
