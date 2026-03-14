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

const { labels, placeholders } = messages;

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
    authenticated: false,
    loggedInUser: {
      is_admin: true,
    },
  },
  utils: {
    remember_me: {
      email: "",
      password: "",
    },
  },
});

afterEach(cleanup);

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render heading and labels", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    let heading = screen.getByText("Welcome back!");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.emailPhone)).toBeInTheDocument();
    expect(screen.getByText(labels.password)).toBeInTheDocument();
    expect(screen.getByText("Forgot?")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeVisible();
    expect(screen.getByText("Register")).toBeVisible();
    expect(screen.getByText("Remember Me")).toBeInTheDocument();

    const btnEl = screen.getByTestId("submitButton");
    const btnEl2 = screen.getByTestId("request-otp-btn");

    expect(btnEl2).toBeInTheDocument();
    expect(btnEl).toBeInTheDocument();

    expect(btnEl).toHaveTextContent("Log In");
    expect(btnEl2).toHaveTextContent("Request One Time Password");
    expect(screen.getByText("Login via social accounts-")).toBeInTheDocument();
    // expect(
    //   screen.getByText(
    //     "Enter to the best leaderless consensus building and tracking system in the world."
    //   )
    // ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.emailPhone)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.password)
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toEqual(11);

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    expect(inputEl).toHaveValue("rahul.singh@iffort.com");
    expect(inputEl).toHaveAttribute("placeholder", placeholders.emailPhone);

    const passInputEl = screen.getByPlaceholderText(placeholders.password);
    expect(passInputEl).toBeInTheDocument();
    expect(passInputEl).toHaveAttribute("type", "password");
    userEvent.type(passInputEl, "Test@123");
    expect(passInputEl).toHaveValue("Test@123");
    expect(passInputEl).toHaveAttribute("placeholder", placeholders.password);
  });

  it("pass valid email to test email input field", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    userEvent.type(inputEl, "rahul.singhiffort.com");
    expect(inputEl).toHaveValue("rahul.singhiffort.com");
    userEvent.tab();

    const passInputEl = screen.getByPlaceholderText(placeholders.password);
    userEvent.type(passInputEl, "Test123");
    expect(passInputEl).toHaveValue("Test123");
    userEvent.tab();

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Input is not valid!")).toBeInTheDocument();
    });
  });

  it("click on submit button", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    expect(inputEl).toHaveValue("rahul.singh@iffort.com");
    userEvent.tab();

    const passInputEl = screen.getByPlaceholderText(placeholders.password);
    userEvent.type(passInputEl, "Test@123");
    expect(passInputEl).toHaveValue("Test@123");
    userEvent.tab();

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await act(async () => {
      await login.mockResolvedValue({
        status_code: 200,
        message: "Login successful",
      });
    });
  }, 60_000);

  it("click on submit button 402", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    expect(inputEl).toHaveValue("rahul.singh@iffort.com");
    userEvent.tab();

    const passInputEl = screen.getByPlaceholderText(placeholders.password);
    userEvent.type(passInputEl, "Test@123");
    expect(passInputEl).toHaveValue("Test@123");
    userEvent.tab();

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await act(async () => {
      await login.mockResolvedValue({
        status_code: 402,
        message: "Login failled",
      });
    });
  });

  it("click on submit button with 403", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    expect(inputEl).toHaveValue("rahul.singh@iffort.com");
    userEvent.tab();

    const passInputEl = screen.getByPlaceholderText(placeholders.password);
    userEvent.type(passInputEl, "Test@123");
    expect(passInputEl).toHaveValue("Test@123");
    userEvent.tab();

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await act(async () => {
      await login.mockResolvedValue({
        status_code: 403,
        message: "Login failled",
      });
    });
  });

  test("otp button click", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();

    userEvent.type(inputEl, "admin@gmai.com");

    const btn = screen.getByTestId("request-otp-btn");

    expect(btn).toBeInTheDocument();

    userEvent.click(btn);

    await act(async () => {
      resendOTPForRegistration.mockResolvedValue({
        status_code: 200,
        data: {},
        message: "OTP sent",
      });
    });
  });

  test("Login with otp test", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");

    fireEvent.change(inputEl, { target: { value: "admin@gmai.com" } });
    expect(screen.getByTestId("request-otp-btn")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("request-otp-btn"));

    await act(() => {
      verifyOtp.mockResolvedValue({
        status_code: 200,
        data: {},
        message: "Test message",
      });
    });

    waitFor(async () => {
      expect(screen.getByText("Log In One Time Password")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Note: Verification code has been sent to your registered email address."
        )
      ).toBeInTheDocument();
      const inputEl = screen.getByPlaceholderText(placeholders.otp);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("type", "text");
      userEvent.type(inputEl, "123456");
      const otpB = screen.getByTestId("submitButton");
      expect(otpB).toBeInTheDocument();
      userEvent.click(otpB);
    });
  });

  test("Login with otp test else block", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");

    fireEvent.change(inputEl, { target: { value: "admin@gmai.com" } });

    expect(screen.getByTestId("request-otp-btn")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("request-otp-btn"));

    resendOTPForRegistration.mockResolvedValue({
      status_code: 200,
      data: {},
    });
    verifyOtp.mockResolvedValue({
      status_code: 200,
      data: {},
    });
  });

  test("Testing user interface component", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/login" })}>
          <Login />
        </RouterContext.Provider>
      </Provider>
    );

    const rgBtn = screen.getByTestId("dont-account-link-tag");
    const frBtn = screen.getByTestId("forgot-password-link");

    expect(rgBtn).toBeInTheDocument();
    expect(frBtn).toBeInTheDocument();

    userEvent.click(rgBtn);
    userEvent.click(frBtn);
  });
});
