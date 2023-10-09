import { render, screen, waitFor, cleanup } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import Registration from "../index";
import { socialLogin } from "src/network/api/userApi";

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

// Create a mock store
const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
});

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

jest.mock("src/network/api/userApi");

const originalLocation = window.location;

beforeAll(() => {
  delete global.window.location;
  global.window.location = {
    search: "",
    href: jest.fn(() => Promise.resolve()),
  };
});

afterAll(() => {
  global.window.location = originalLocation;
});

afterEach(cleanup);

describe("Social Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("check social login links and text exists in page", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/",
            query: {},
          })}
        >
          <Registration isNotLogin={false} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Login with social accounts.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      // expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
    });
  });

  it("check social login on signup page links and text exists in page", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/",
            query: {},
          })}
        >
          <Registration isNotLogin={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText("Signup with social accounts.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      // expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
      userEvent.click(screen.getByTestId("github"));
      socialLogin.mockResolvedValue({
        status_code: 200,
        data: { url: "test url" },
        message: "fetched!",
      });
    });
  });

  it("check if not login social login on signup page links and text exists in page", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/",
            query: {},
          })}
        >
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText("Login with social accounts.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      // expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
      userEvent.click(screen.getByTestId("linkedin"));
      socialLogin.mockResolvedValue({
        status_code: 200,
        data: { url: "test url" },
        message: "fetched!",
      });
    });
  });
});
