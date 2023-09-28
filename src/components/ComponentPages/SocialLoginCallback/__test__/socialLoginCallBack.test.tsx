import { Fragment } from "react";
import { cleanup, render, screen, waitFor } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";
import { act } from "react-dom/test-utils";

import SocialLoginCallback from "../";
import { store } from "src/store";
import Modals from "src/components/ComponentPages/Registration/registrationModal";
import { socialLoginCallback, socialLoginLinkUser } from "src/network/api/userApi";

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

jest.mock("src/network/api/userApi");

const originalLocation = window.location;

beforeAll(() => {
  delete global.window.location;
  delete global.window.localStorage;
  global.window.location = {
    search: "?provider=facebook&code=fake_token",
  };
  global.window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
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
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();
  });

  test("API failled response", async () => {
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
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();
  });

  test("API failled socialLoginCallback response", async () => {
    socialLoginCallback.mockResolvedValue({
      status_code: 400,
      data: {},
    });

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

    await waitFor(() => {
      expect(socialLoginCallback).toHaveBeenCalled();
    });
  });

  test("API failled socialLoginCallback 422 response", async () => {
    socialLoginCallback.mockResolvedValue({
      status_code: 422,
      data: {},
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
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
      ui: {
        showSocialLoginEmailPopup: false,
        registrationModalVisible: false,
        showSocialLoginNamePopup: true,
      },
      utils: { redirect_type: "redirect", redirect_tab_setting: "setting" },
    });

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
            <Modals />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    await waitFor(() => {
      expect(socialLoginCallback).toHaveBeenCalled();
      expect(screen.getByTestId("content-text")).toBeInTheDocument();
    });
  });

  test("API failled socialLoginCallback 423 response", async () => {
    socialLoginCallback.mockResolvedValue({
      status_code: 422,
      data: {},
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
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
      ui: {
        showSocialLoginEmailPopup: false,
        registrationModalVisible: false,
        showSocialLoginNamePopup: true,
      },
      utils: { redirect_type: "redirect", redirect_tab_setting: "setting" },
    });

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
            <Modals />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    await waitFor(() => {
      expect(socialLoginCallback).toHaveBeenCalled();
      expect(screen.getByTestId("content-text")).toBeInTheDocument();
    });
  });

  test("API failled socialLoginLinkUser response", async () => {
    act(() => {
      global.localStorage.setItem = jest.fn(() => ({
        redirectTab: "redirectTab",
      }));
      global.localStorage.getItem = jest.fn(() => "redirectTab");
    });
    socialLoginLinkUser.mockResolvedValue({
      status_code: 200,
      data: {},
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
        },
      },
      ui: {
        showSocialLoginEmailPopup: false,
        registrationModalVisible: false,
        showSocialLoginNamePopup: true,
      },
      utils: { redirect_type: "redirect", redirect_tab_setting: "setting" },
    });

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

    await waitFor(() => {
      expect(socialLoginLinkUser).toHaveBeenCalled();
      expect(screen.getByTestId("content-text")).toBeInTheDocument();
    });
  });
  test("API failled socialLoginLinkUser 403 response", async () => {
    jest.mock("src/network/api/userApi", () => ({
      socialLoginLinkUser: jest.fn(() =>
        Promise.resolve({
          status_code: 403,
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
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();
  });

  test("without query params", async () => {
    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/login/github/callback",
              query: {},
            })}
          >
            <SocialLoginCallback />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getByTestId("btnwrap")).toBeInTheDocument();
    expect(screen.getByTestId("content-text")).toBeInTheDocument();
    expect(screen.getByTestId("panel-2")).toBeInTheDocument();
    expect(screen.getByTestId("list-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-card")).toBeInTheDocument();
    expect(screen.getByTestId("help-crd-wrap")).toBeInTheDocument();
    expect(screen.getByTestId("collapse-panel")).toBeInTheDocument();
    expect(screen.getByTestId("title-tag")).toBeInTheDocument();
  });
});
