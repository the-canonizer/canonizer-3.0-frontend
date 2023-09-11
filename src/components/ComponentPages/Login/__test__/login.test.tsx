import {
  act,
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import Login from "../index";
import messages from "src/messages";
import { store } from "src/store";

import {
  login,
  resendOTPForRegistration,
  verifyOtp,
} from "src/network/api/userApi";

const { labels, placeholders, validations } = messages;

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

jest.mock("src/network/api/userApi");

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
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
});

afterEach(cleanup);

describe("Login page", () => {
  beforeEach(() => {
    jest.mock("src/network/api/userApi", () => ({
      login: jest.fn(() => Promise.resolve({ status_code: 200 })),
      verifyOtp: jest.fn(() => Promise.resolve({ status_code: 200 })),
      resendOTPForRegistration: jest.fn(() =>
        Promise.resolve({ status_code: 200 })
      ),
    }));
  });

  test("render component", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
  });

  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      let heading = screen.getByRole("heading", {
        name: /Login To Canonizer/i,
      });
      expect(heading).toHaveTextContent("Heading");
      expect(heading).toBeInTheDocument();
      expect(screen.getByText(labels.emailPhone)).toBeInTheDocument();
      expect(screen.getByText(labels.password)).toBeInTheDocument();
      expect(screen.getByText("Forgot Password").closest("a")).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByText("Don't have an account?")).toBeVisible();
      expect(screen.getByText("Register Now")).toBeVisible();
      expect(screen.getByText("Remember Me")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Enter to the best leaderless consensus building and tracking system in the world."
        )
      ).toBeInTheDocument();
    });
  });

  it("render username input field", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("type", "text");
      expect(inputEl).toHaveAttribute("placeholder", placeholders.emailPhone);
    });
  });

  it("render password fields", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.password);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("type", "password");
      expect(inputEl).toHaveAttribute("placeholder", placeholders.password);
    });
  });

  it("pass valid email to test email input field", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
      userEvent.type(inputEl, "rahul.singh@iffort.com");

      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      waitFor(async () => {
        const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
        userEvent.type(inputEl, "rahul.singhiffort.com");
        userEvent.tab();

        expect(screen.getByText("Input is not valid!")).toBeInTheDocument();
      });
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await act(async () => {
      const btnEl = screen.getByTestId("submitButton");

      await userEvent.click(btnEl);
    });
    waitFor(() => {
      expect(screen.getByText(validations.username)).toBeVisible();
      expect(screen.getByText(validations.password)).toBeVisible();
    });
  });

  it("test api response", async () => {
    login.mockResolvedValue({
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
    });

    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
  });
  test("otp button click", async () => {
    login.mockResolvedValue({
      status_code: 200,
      data: {},
    });
    resendOTPForRegistration.mockResolvedValue({
      status_code: 200,
      data: {},
    });
    verifyOtp.mockResolvedValue({
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
    });

    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");

    fireEvent.change(inputEl, { target: { value: "admin@gmai.com" } });
    expect(screen.getByTestId("request-otp-btn")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("request-otp-btn"));

    waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(resendOTPForRegistration).toHaveBeenCalled();
      expect(verifyOtp).toHaveBeenCalled();
    });
  });
  test("for failled response", async () => {
    login.mockResolvedValue({
      status_code: 400,
      data: {},
    });
    resendOTPForRegistration.mockResolvedValue({
      status_code: 400,
      data: {},
    });
    verifyOtp.mockResolvedValue({
      status_code: 400,
      data: {},
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
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
    });

    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");

    fireEvent.change(inputEl, { target: { value: "admin@gmai.com" } });
    expect(screen.getByTestId("request-otp-btn")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("request-otp-btn"));

    waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(resendOTPForRegistration).toHaveBeenCalled();
      expect(verifyOtp).toHaveBeenCalled();
    });
  });
});
