import { cleanup, render, screen, waitFor } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import ForgotPassword from "../index";
import messages from "src/messages";
import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
} from "src/network/api/userApi";

const { labels, placeholders, validations } = messages;

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
    pathname: "/forgot-password",
    route: "/forgot-password",
    query: {},
    asPath: "/forgot-password",
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

afterEach(cleanup);

describe("Forgot Password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("render heading and labels", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forgot-password",
            query: {},
          })}
        >
          <ForgotPassword isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    let heading = screen.getByRole("heading", {
      name: labels.forgotModalLabel,
    });
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(
        "Don't worry, it happens. Let us know the email address you signed up"
      )
    ).toBeVisible();
    expect(
      screen.getByText("with and we'll send you an email with instructions.")
    ).toBeVisible();
    expect(screen.getByText(labels.emailId)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toEqual(2);

    const btn = screen.getByTestId("submitButton");
    expect(btn).toBeInTheDocument();

    const emailInp = screen.getByPlaceholderText(placeholders.emailId);
    expect(emailInp).toBeInTheDocument();
    expect(emailInp).toHaveAttribute("type", "text");
    expect(emailInp).toHaveAttribute("placeholder", placeholders.emailId);
    userEvent.type(emailInp, "test@gmail.com");
    userEvent.tab();
    expect(emailInp).toHaveValue("test@gmail.com");

    userEvent.click(btn);

    forgotPasswordSendOTP.mockResolvedValue({
      status_code: 200,
      error: null,
      message: "OTP Sent!",
    });

    await waitFor(() => {
      expect(forgotPasswordSendOTP).toHaveBeenCalled();
      expect(screen.getByText("OTP Sent!")).toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forgot-password",
            query: {},
          })}
        >
          <ForgotPassword isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    const emailInp = screen.getByPlaceholderText(placeholders.emailId);
    expect(emailInp).toBeInTheDocument();
    userEvent.type(emailInp, "testgmail.com");
    userEvent.tab();
    expect(emailInp).toHaveValue("testgmail.com");

    await waitFor(() => {
      expect(screen.getByText(validations.validEmail)).toBeVisible();
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forgot-password",
            query: {},
          })}
        >
          <ForgotPassword isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText(validations.email)).toBeVisible();
    });
  });
});

describe("OTP page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("render heading and text", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forgot-password",
            query: {},
          })}
        >
          <ForgotPassword isModal={false} isTestScreen={1} />
        </RouterContext.Provider>
      </Provider>
    );

    let heading = screen.getByText(labels.verificationLabel);
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.testOtp)).toBeInTheDocument();

    const otp = screen.getByPlaceholderText(placeholders.otp);

    expect(otp).toBeInTheDocument();
    expect(otp).toHaveAttribute("type", "text");
    expect(otp).toHaveAttribute("placeholder", placeholders.otp);
    userEvent.type(otp, "123456");
    expect(otp).toHaveValue("123456");

    const btnEl = screen.getByTestId("submitButton");
    expect(btnEl).toBeInTheDocument();
    userEvent.click(btnEl);

    forgotPasswordVerifyOTP.mockResolvedValue({
      status_code: 200,
      error: null,
      message: "OTP Verified!",
    });

    await waitFor(() => {
      expect(forgotPasswordVerifyOTP).toHaveBeenCalled();
      expect(screen.getByText("OTP Verified!")).toBeInTheDocument();
    });
  });

  it("check otp length not greater that 6 chars", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456789");
    userEvent.tab();

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await waitFor(() => {
      expect(inputEl).toHaveValue("123456789");
      expect(screen.getByText(validations.otpLength)).toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.getByText(validations.otp)).toBeVisible();
    });
  });
});
