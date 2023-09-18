import { render, screen, waitFor, act, cleanup } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";

import ResetPassword from "../index";
import messages from "../../../../messages";
import { forgotPasswordUpdate } from "src/network/api/userApi";

const { placeholders, labels, validations } = messages;

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/reset-password",
    route: "/reset-password",
    query: {},
    asPath: "/reset-password",
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

jest.mock("src/network/api/userApi");

beforeAll(() => {
  delete global.window.localStorage;

  global.window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

afterEach(cleanup);

describe("Reset Password page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render heading labels, text and inputs", async () => {
    act(() => {
      global.localStorage.setItem = jest.fn(() => ({
        verified: "verified",
      }));

      global.localStorage.getItem = jest.fn(() => "verified");
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <ResetPassword is_test={true} />
        </RouterContext.Provider>
      </Provider>
    );

    let heading = screen.getByText(labels.createPassword);

    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();

    const newPassword = screen.getByPlaceholderText(placeholders.newPassword);
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );
    const btnEl = screen.getByTestId("submitButton");

    expect(newPassword).toBeInTheDocument();
    expect(newPassword).toHaveAttribute("type", "password");
    expect(newPassword).toHaveAttribute(
      "placeholder",
      placeholders.newPassword
    );

    expect(confirmPassword).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute(
      "placeholder",
      placeholders.confirmPassword
    );
    expect(btnEl).toBeInTheDocument();
  });

  it("if password length is less than 8 show error message", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <ResetPassword is_test={true} />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    userEvent.type(inputEl, "1234567");
    userEvent.tab();
    expect(inputEl).toHaveValue("1234567");

    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );
    userEvent.type(confirmPassword, "123456");
    userEvent.tab();
    expect(confirmPassword).toHaveValue("123456");

    await waitFor(() => {
      expect(screen.queryAllByRole("alert").length).toEqual(2);
      expect(screen.queryByText(validations.passwordPattern)).toBeVisible();
      expect(screen.queryByText(validations.confirmPasswordErr)).toBeVisible();
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <ResetPassword is_test={true} />
        </RouterContext.Provider>
      </Provider>
    );

    const btnEl = screen.getByTestId("submitButton");
    userEvent.click(btnEl);

    await waitFor(() => {
      expect(
        screen.queryByText(validations.registrationPassword)
      ).toBeVisible();
      expect(screen.queryByText(validations.confirmPassword)).toBeVisible();
    });
  });

  it("Redirect to login", async () => {
    act(() => {
      global.localStorage.setItem = jest.fn(() => ({
        verified: "verified",
      }));

      global.localStorage.getItem = jest.fn(() => "verified");
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <ResetPassword />
        </RouterContext.Provider>
      </Provider>
    );

    let heading = screen.getByText(labels.createPassword);

    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("Submit valid form ", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <ResetPassword is_test={true} />
        </RouterContext.Provider>
      </Provider>
    );

    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    userEvent.type(inputEl, "Test@123");
    userEvent.tab();
    expect(inputEl).toHaveValue("Test@123");

    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );
    userEvent.type(confirmPassword, "Test@123");
    userEvent.tab();
    expect(confirmPassword).toHaveValue("Test@123");

    const btnEl = screen.getByTestId("submitButton");
    expect(btnEl).toBeInTheDocument();
    userEvent.click(btnEl);

    forgotPasswordUpdate.mockResolvedValue({
      status_code: 200,
      data: {},
      message: "Password changed sucessfully!",
    });

    await waitFor(() => {
      expect(forgotPasswordUpdate).toHaveBeenCalled();
      expect(
        screen.getByText("Password changed sucessfully!")
      ).toBeInTheDocument();
    });
  });
});
