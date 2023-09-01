import React, { Fragment } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { act } from "react-dom/test-utils";

import { firebaseCloudMessaging } from "src/firebaseConfig/firebase";

import Notifications from "../";
import Fav from "../icon";

import { updateFCMToken, getLists } from "src/network/api/notificationAPI";

jest.mock("src/firebaseConfig/firebase", () => ({
  firebaseCloudMessaging: {
    init: jest.fn(),
  },
}));

jest.mock("src/network/api/notificationAPI");

jest.mock("localforage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn().mockResolvedValue(),
}));

jest.mock("firebase/app", () => ({
  messaging: () => ({
    getToken: jest.fn(() =>
      Promise.resolve(
        "fake_token_R0lGODlhAQABAIAAAAAAAP_yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      )
    ),
    onMessage: jest.fn(),
  }),
}));

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "/",
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

const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  notifications: {
    headerNotification: {
      count: 100,
      list: [].fill(
        {
          id: Math.random() * 150,
          message_body: "test body_" + Math.random() * 150,
          is_read: 1,
          created_at: Date.now(),
        },
        0,
        100
      ),
    },
  },
});

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

const originalLocation = window.navigator;
const originaPushManager = window.PushManager;
const originaNotification = window.Notification;

beforeAll(() => {
  delete global.window.navigator;
  delete global.window.PushManager;
  delete global.window.Notification;
  global.window.navigator = {
    serviceWorker: { ready: Promise.resolve(true) },
  };
  global.window.PushManager = {};
  global.window.Notification = {
    requestPermission: jest.fn().mockResolvedValue("granted"),
  };
});

afterAll(() => {
  global.window.navigator = originalLocation;
  global.window.PushManager = originaPushManager;
  global.window.Notification = originaNotification;
});

afterEach(cleanup);

describe("Header Notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Notifications component", () => {
    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("renders the image with correct attributes", () => {
    render(<Fav />);

    const image = screen.getByAltText("fav-icon");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );
  });

  test("enables push notification and updates token", async () => {
    const mockToken = "mocked-token";
    const mockServiceWorker = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = mockServiceWorker;
    global.navigator.PushManager = {};

    firebaseCloudMessaging.init.mockResolvedValueOnce(mockToken);

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const clicked = screen.getByTestId("clickable");
    fireEvent.click(clicked);

    expect(screen.getByText("notifications"));

    const enableSwitch = screen.getByTestId("enable-text");
    expect(screen.getByText("Enable push notification"));

    fireEvent.click(enableSwitch);

    expect(firebaseCloudMessaging.init).toHaveBeenCalled();
    expect(firebaseCloudMessaging.init).toHaveBeenCalledWith();
  });

  test("disables push notification and removes token", async () => {
    const mockServiceWorker = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = mockServiceWorker;
    global.navigator.PushManager = {};

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const clicked = screen.getByTestId("clickable");
    fireEvent.click(clicked);

    const disableSwitch = screen.getByTestId("enable-text");
    expect(screen.getByText("Enable push notification"));
    fireEvent.click(disableSwitch);
  });

  test("test get list api success call", async () => {
    getLists.mockResolvedValue({
      status_code: 200,
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
      notifications: {
        headerNotification: {
          count: 100,
          list: [].fill(
            {
              id: Math.random() * 150,
              message_body: "test body_" + Math.random() * 150,
              is_read: 1,
              created_at: Date.now(),
            },
            0,
            100
          ),
        },
      },
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider value={createMockRouter({})}>
            <Notifications />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const btn = screen.getByTestId("clickable");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    const swBtn = screen.getByRole("switch");
    expect(swBtn).toBeInTheDocument();
    fireEvent.click(swBtn);

    await waitFor(() => {
      expect(getLists).toHaveBeenCalled();
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  test("permission denied msg", async () => {
    act(() => {
      jest.mock("firebase/app", () => ({
        messaging: jest.fn().mockResolvedValue({
          onMessage: jest.fn(),
          getToken: jest
            .fn()
            .mockResolvedValue(
              "fake_token_R0lGODlhAQABAIAAAAAAAP_yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            ),
        }),
      }));
      global.window.Notification = {
        requestPermission: jest.fn().mockResolvedValue("failed"),
      };
    });

    updateFCMToken.mockResolvedValue({
      status_code: 200,
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
      notifications: {
        headerNotification: {
          count: 100,
          list: [].fill(
            {
              id: Math.random() * 150,
              message_body: "test body_" + Math.random() * 150,
              is_read: 1,
              created_at: Date.now(),
            },
            0,
            100
          ),
        },
      },
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider value={createMockRouter({})}>
            <Notifications />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const btn = screen.getByTestId("clickable");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    const swBtn = screen.getByRole("switch");
    expect(swBtn).toBeInTheDocument();
    fireEvent.click(swBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Notification permission denied!")
      ).toBeInTheDocument();
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  test("test update token api success call", async () => {
    updateFCMToken.mockResolvedValue({
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
      notifications: {
        headerNotification: {
          count: 100,
          list: [].fill(
            {
              id: Math.random() * 150,
              message_body: "test body_" + Math.random() * 150,
              is_read: 1,
              created_at: Date.now(),
            },
            0,
            100
          ),
        },
      },
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider value={createMockRouter({})}>
            <Notifications />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const btn = screen.getByTestId("clickable");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    const swBtn = screen.getByRole("switch");
    expect(swBtn).toBeInTheDocument();
    fireEvent.click(swBtn);

    waitFor(() => {
      expect(screen.getByText("99+")).toBeInTheDocument();
      expect(updateFCMToken).toHaveBeenCalled();
    });
  });

  test("test failed update token api call", async () => {
    jest.mock("firebase/app", () => ({
      messaging: () => ({
        getToken: jest.fn(() => Promise.reject("")),
        onMessage: jest.fn(),
      }),
    }));

    updateFCMToken.mockResolvedValue({
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
      notifications: {
        headerNotification: {
          count: 100,
          list: [].fill(
            {
              id: Math.random() * 150,
              message_body: "test body_" + Math.random() * 150,
              is_read: 1,
              created_at: Date.now(),
            },
            0,
            100
          ),
        },
      },
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider value={createMockRouter({})}>
            <Notifications />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const btn = screen.getByTestId("clickable");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    const swBtn = screen.getByRole("switch");
    expect(swBtn).toBeInTheDocument();
    fireEvent.click(swBtn);

    waitFor(() => {
      expect(screen.getByText("99+")).toBeInTheDocument();
      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
      expect(updateFCMToken).toHaveBeenCalled();
    });
  });

  test("permission reject msg", async () => {
    act(() => {
      jest.mock("firebase/app", () => ({
        messaging: jest.fn().mockResolvedValue({
          onMessage: jest.fn(),
          getToken: jest
            .fn()
            .mockResolvedValue(
              "fake_token_R0lGODlhAQABAIAAAAAAAP_yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            ),
        }),
      }));
      global.window.Notification = {
        requestPermission: jest.fn(() => Promise.reject("error")),
      };
    });

    updateFCMToken.mockResolvedValue({
      status_code: 200,
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
      notifications: {
        headerNotification: {
          count: 100,
          list: [].fill(
            {
              id: Math.random() * 150,
              message_body: "test body_" + Math.random() * 150,
              is_read: 1,
              created_at: Date.now(),
            },
            0,
            100
          ),
        },
      },
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider value={createMockRouter({})}>
            <Notifications />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const btn = screen.getByTestId("clickable");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    const swBtn = screen.getByRole("switch");
    expect(swBtn).toBeInTheDocument();
    fireEvent.click(swBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to request notification permission:")
      ).toBeInTheDocument();
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });
});
