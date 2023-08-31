import { Fragment } from "react";
import { cleanup, render, screen } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import SocialLoginCallback from "../";
import { store } from "src/store";

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "/login/github/callback?code=2f2edb1c8d8d56355b19",
    pathname: "/login/[provider]/callback",
    route: "/login/github/callback?code=2f2edb1c8d8d56355b19",
    query: { provider: "facebook", code: "2f2edb1c8d8d56355b19" },
    asPath: "/login/github/callback?code=2f2edb1c8d8d56355b19",
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

jest.mock("src/network/api/userApi", () => ({
  socialLoginCallback: jest.fn(() =>
    Promise.resolve({
      status_code: 200,
      data: {},
    })
  ),
  socialLoginLinkUser: jest.fn(() =>
    Promise.resolve({
      status_code: 200,
      data: {},
    })
  ),
}));

const originalLocation = window.location;
beforeAll(() => {
  delete global.window.location;
  global.window.location = {
    search: "?provider=facebook&code=fake_token",
  };
});

afterAll(() => {
  global.window.location = originalLocation;
});

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: false,
    loggedInUser: {
      is_admin: false,
    },
  },
  topicDetails: {
    currentCampRecord: {},
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
  utils: { redirect_type: "redirect", redirect_tab_setting: "setting" },
});

afterEach(cleanup);

describe("Social Login Callback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi", () => ({
      socialLoginCallback: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: {},
        })
      ),
      socialLoginLinkUser: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: {},
        })
      ),
    }));
  });
  it("render heading and labels", () => {
    render(
      <Fragment>
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/login/github/callback?code=2f2edb1c8d8d56355b19",
              query: { provider: "facebook", code: "2f2edb1c8d8d56355b19" },
            })}
          >
            <SocialLoginCallback />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  test("API response", async () => {
    jest.mock("src/network/api/userApi", () => ({
      socialLoginCallback: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: {},
        })
      ),
      socialLoginLinkUser: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: {},
        })
      ),
    }));

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/login/github/callback?code=2f2edb1c8d8d56355b19",
              query: { provider: "facebook", code: "2f2edb1c8d8d56355b19" },
            })}
          >
            <SocialLoginCallback />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByTestId("btnwrap")).toBeInTheDocument();
    // expect(screen.getByTestId("collapse-card")).toBeInTheDocument();
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();

    // await waitFor(() => {
    //   expect(socialLoginCallback).toHaveBeenCalled();
    //   expect(socialLoginLinkUser).toHaveBeenCalled();
    // });
  });

  test("API failled response", async () => {
    // socialLoginCallback.mockResolvedValue({
    //   status_code: 400,
    //   data: {},
    // });
    // socialLoginLinkUser.mockResolvedValue({
    //   status_code: 400,
    //   data: {},
    // });

    jest.mock("src/network/api/userApi", () => ({
      socialLoginCallback: jest.fn(() =>
        Promise.resolve({
          status_code: 400,
          data: {},
        })
      ),
      socialLoginLinkUser: jest.fn(() =>
        Promise.resolve({
          status_code: 400,
          data: {},
        })
      ),
    }));

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/login/github/callback?code=2f2edb1c8d8d56355b19",
              query: { provider: "facebook", code: "2f2edb1c8d8d56355b19" },
            })}
          >
            <SocialLoginCallback />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getByTestId("btnwrap")).toBeInTheDocument();
    // expect(screen.getByTestId("collapse-card")).toBeInTheDocument();
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();

    // await waitFor(() => {
    // expect(socialLoginCallback).toHaveBeenCalled();
    // expect(socialLoginLinkUser).toHaveBeenCalled();
    // });
  });
});
