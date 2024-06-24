import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";

import Registration from "../";
import messages from "../../../../messages";
import { register, verifyOtp, getCountryCodes } from "src/network/api/userApi";

const { labels, placeholders } = messages;

// Mock dependencies
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

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

jest.mock("react-google-recaptcha-v3", () => ({
  __esModule: true,
  useGoogleReCaptcha: jest.fn(() => ({
    executeRecaptcha: jest.fn(() => Promise.resolve("fakeToken")),
  })),
}));

jest.mock("src/network/api/userApi");

describe("Registration page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Registration component with labels and inputs", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );

    getCountryCodes.mockResolvedValueOnce({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    });

    await waitFor(() => {
      expect(getCountryCodes).toHaveBeenCalled();
    });

    let heading = screen.getByRole("heading", {
      name: /Create your account/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeVisible();
    expect(screen.getByText("All fields are mandatory.")).toBeVisible();
    expect(screen.getByText("Login Here")).toBeVisible();
    expect(screen.getByText(labels.firstName)).toBeInTheDocument();
    expect(screen.getByText(labels.lastName)).toBeInTheDocument();
    expect(screen.getByText(labels.email)).toBeInTheDocument();
    expect(screen.getByText(labels.phone)).toBeInTheDocument();
    expect(screen.getByText(labels.registrationPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const phone = screen.getByPlaceholderText(placeholders.phone);
    const registrationPassword = screen.getByPlaceholderText(
      placeholders.registrationPassword
    );
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

    expect(firstName).toBeInTheDocument();
    expect(firstName).toHaveAttribute("type", "text");
    expect(firstName).toHaveAttribute("placeholder", placeholders.firstName);

    expect(lastName).toBeInTheDocument();
    expect(lastName).toHaveAttribute("type", "text");
    expect(lastName).toHaveAttribute("placeholder", placeholders.lastName);

    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("type", "text");
    expect(email).toHaveAttribute("placeholder", placeholders.email);

    expect(phone).toBeInTheDocument();
    expect(phone).toHaveAttribute("type", "tel");
    expect(phone).toHaveAttribute("placeholder", placeholders.phone);

    expect(registrationPassword).toBeInTheDocument();
    expect(registrationPassword).toHaveAttribute("type", "password");
    expect(registrationPassword).toHaveAttribute(
      "placeholder",
      placeholders.registrationPassword
    );

    expect(confirmPassword).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute(
      "placeholder",
      placeholders.confirmPassword
    );
  });

  it("click on the submit button", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );

    getCountryCodes.mockResolvedValueOnce({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    });

    await waitFor(() => {
      expect(getCountryCodes).toHaveBeenCalled();
    });

    const submitBtn = screen.getByTestId("submitButton");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute("type", "submit");

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const phone = screen.getByPlaceholderText(placeholders.phone);
    const registrationPassword = screen.getByPlaceholderText(
      placeholders.registrationPassword
    );
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

    userEvent.type(firstName, "John");
    userEvent.type(lastName, "Doe");
    userEvent.type(email, "John@example.com");
    userEvent.type(phone, "9876543211");
    userEvent.type(registrationPassword, "Test@123");
    userEvent.type(confirmPassword, "Test@123");

    userEvent.click(submitBtn);

    register.mockResolvedValue({
      status_code: 200,
      message: "Registration successful",
    });

    // const registerMock = jest
    //   .spyOn(() => "src/network/api/userApi", "register")
    //   .mockResolvedValue({
    //     status_code: 200,
    //     message: "Registration successful",
    //   });

    // expect(register).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     first_name: "John",
    //     last_name: "Doe",
    //     email: "John@example.com",
    //     phone: "9876543211",
    //     password: "Test@123",
    //     confirm_password: "Test@123",
    //     captcha_token: "fakeToken",
    //   })
    // );

    const loginBtn = screen.getByText("Login Here");
    expect(loginBtn).toBeInTheDocument();
    userEvent.click(loginBtn);
  });

  it("switches to OTP screen on successful registration", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration isTest={true} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText("Registration successful")).toBeInTheDocument();
    expect(
      screen.getByText("Log In One Time Verification Code")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Note : Registration code has been sent to your registered email address."
      )
    ).toBeInTheDocument();
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    expect(inputEl).toBeInTheDocument();
    userEvent.type(inputEl, "123456");
    userEvent.tab();
    expect(inputEl).toHaveValue("123456");
    const btn = screen.getByTestId("submitButton");
    expect(btn).toBeInTheDocument();
    userEvent.click(btn);
    // 200
    verifyOtp.mockResolvedValue({
      status_code: 200,
      error: {
        first_name: "something have need to change",
      },
      message: "OTP Validate",
    });
  });

  it("check with other status 400", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );

    getCountryCodes.mockResolvedValueOnce({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    });

    await waitFor(() => {
      expect(getCountryCodes).toHaveBeenCalled();
    });

    const submitBtn = screen.getByTestId("submitButton");

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const phone = screen.getByPlaceholderText(placeholders.phone);
    const registrationPassword = screen.getByPlaceholderText(
      placeholders.registrationPassword
    );
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

    userEvent.type(firstName, "John");
    userEvent.type(lastName, "Doe");
    userEvent.type(email, "John@example.com");
    userEvent.type(phone, "9876543211");
    userEvent.type(registrationPassword, "Test@123");
    userEvent.type(confirmPassword, "Test@123");

    userEvent.click(submitBtn);

    // 400
    register.mockResolvedValue({
      status_code: 400,
      error: {
        first_name: "something have need to change",
      },
      message: "Registration failed",
    });

    waitFor(() => {
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });

  it("check with other status 403", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );

    getCountryCodes.mockResolvedValueOnce({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    });

    await waitFor(() => {
      expect(getCountryCodes).toHaveBeenCalled();
    });

    const submitBtn = screen.getByTestId("submitButton");

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const phone = screen.getByPlaceholderText(placeholders.phone);
    const registrationPassword = screen.getByPlaceholderText(
      placeholders.registrationPassword
    );
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

    userEvent.type(firstName, "John");
    userEvent.type(lastName, "Doe");
    userEvent.type(email, "John@example.com");
    userEvent.type(phone, "9876543211");
    userEvent.type(registrationPassword, "Test@123");
    userEvent.type(confirmPassword, "Test@123");

    userEvent.click(submitBtn);
    // 403
    register.mockResolvedValue({
      status_code: 403,
      message: "Something went wrong!",
    });
    await waitFor(() => {
      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    });
  });

  it("check with other status 406", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );

    getCountryCodes.mockResolvedValueOnce({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    });

    await waitFor(() => {
      expect(getCountryCodes).toHaveBeenCalled();
    });

    const submitBtn = screen.getByTestId("submitButton");

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const phone = screen.getByPlaceholderText(placeholders.phone);
    const registrationPassword = screen.getByPlaceholderText(
      placeholders.registrationPassword
    );
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

    userEvent.type(firstName, "John");
    userEvent.type(lastName, "Doe");
    userEvent.type(email, "John@example.com");
    userEvent.type(phone, "9876543211");
    userEvent.type(registrationPassword, "Test@123");
    userEvent.type(confirmPassword, "Test@123");

    userEvent.click(submitBtn);

    // 406
    register.mockResolvedValue({
      status_code: 406,
      message: "Errors",
    });

    await waitFor(() => {
      expect(screen.getByText("Errors")).toBeInTheDocument();
    });
  });
});
