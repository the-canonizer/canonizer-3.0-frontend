import { act, render, screen, waitFor, cleanup } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

import Login from "../index";
import messages from "src/messages";
import { store } from "src/store";

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

  it("render password input field", () => {
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
});
