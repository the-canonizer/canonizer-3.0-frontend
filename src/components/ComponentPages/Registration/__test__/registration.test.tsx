import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import Registration from "../";
import messages from "../../../../messages";
import { store } from "src/store";

const { labels, placeholders, validations } = messages;

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

jest.mock("react-google-recaptcha-v3", () => ({
  __esModule: true,
  useGoogleReCaptcha: jest.fn(() => ({
    executeRecaptcha: jest.fn(() => Promise.resolve("fakeToken")),
  })),
}));

jest.mock("src/network/api/userApi", () => ({
  register: jest.fn(() => Promise.resolve({ status_code: 200, data: [] })),
  verifyOtp: jest.fn(() => Promise.resolve({ status_code: 200, data: [] })),
  getCountryCodes: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  resendOTPForRegistration: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: {} })
  ),
}));

describe("Registration page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi", () => ({
      register: jest.fn(() => Promise.resolve({ status_code: 200, data: [] })),
      verifyOtp: jest.fn(() => Promise.resolve({ status_code: 200, data: [] })),
      getCountryCodes: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: [] })
      ),
      resendOTPForRegistration: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: {} })
      ),
    }));
  });

  test("renders AddOrManage component", () => {
    render(
      <Provider store={store}>
        <Registration isModal={true} isTest={true} />
      </Provider>
    );

    const mockGetThreadData = jest.fn().mockResolvedValueOnce({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });
    jest.mock("src/network/api/userApi", () => ({
      getCountryCodes: mockGetThreadData,
    }));
    expect(screen.getByText("Thread 1")).toBeInTheDocument();
  });

  it("resets form fields and switches screen when closeModal is called", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={true} isTest={true} />
        </RouterContext.Provider>
      </Provider>
    );

    jest.mock("src/network/api/userApi", () => ({
      verifyOtp: jest.fn(() => Promise.resolve({ status_code: 400, data: [] })),
    }));

    // Mocking dispatch and resetFields
    // const hideModalMock = jest.fn();
    // const resetFieldsMock = jest.fn();

    // jest.spyOn(React, "useEffect").mockImplementationOnce((effect) => effect());
    // jest.spyOn(React, "useState").mockReturnValueOnce([false, jest.fn()]);
    // jest.spyOn(React, "useState").mockReturnValueOnce([[], jest.fn()]);
    // jest
    //   .spyOn(React, "useState")
    //   .mockReturnValueOnce([{ email: "" }, jest.fn()]);
    // jest.spyOn(React, "useState").mockReturnValueOnce(["", jest.fn()]);
    // jest.spyOn(React, "useState").mockReturnValueOnce([true, jest.fn()]);

    // jest
    //   .spyOn(Form, "useForm")
    //   .mockReturnValueOnce([{ resetFields: resetFieldsMock }, jest.fn()]);
    // jest
    //   .spyOn(Form, "useForm")
    //   .mockReturnValueOnce([{ resetFields: jest.fn() }, jest.fn()]);

    // jest.spyOn(ReactRedux, "useDispatch").mockReturnValueOnce(hideModalMock);

    // Click the close button
    // fireEvent.click(screen.getByText("Close"));

    // Verify that dispatch was called to hide the modal
    // expect(hideModalMock).toHaveBeenCalledWith(hideRegistrationModal());

    // Verify that resetFields was called on the appropriate form
    // expect(resetFieldsMock).toHaveBeenCalled();

    // Verify that isOtpScreen is set to false
    expect(screen.queryByTestId("otp-verify")).not.toBeInTheDocument();
  });

  it("switches to OTP screen", async () => {
    act(() => {
      jest.mock("src/network/api/userApi", () => ({
        register: jest.fn(() =>
          Promise.resolve({ status_code: 200, data: [] })
        ),
        verifyOtp: jest.fn(() =>
          Promise.resolve({ status_code: 200, data: [] })
        ),
        getCountryCodes: jest.fn(() =>
          Promise.resolve({ status_code: 200, data: [] })
        ),
        resendOTPForRegistration: jest.fn(() =>
          Promise.resolve({ status_code: 200, data: {} })
        ),
      }));
    });
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    // Fill out registration form
    // userEvent.type(screen.getByLabelText("First Name"), "John");

    // fireEvent.click(screen.getByText("Register"));

    // Mock successful API response
    // const registerMock = jest
    //   .spyOn("src/network/api/userApi", "register")
    //   .mockResolvedValue({
    //     status_code: 200,
    //     message: "Registration successful",
    //   });

    // Wait for form submission and switch to OTP screen
    waitFor(() => expect(screen.getByTestId("otp-verify")).toBeInTheDocument());

    // Ensure the API was called with correct data
    // expect(registerMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     first_name: "John",
    //     captcha_token: "fakeToken",
    //   })
    // );
  });

  it("shows error message on failed registration", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    waitFor(() => expect(screen.getByTestId("verify")).toBeInTheDocument());
  });

  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    waitFor(async () => {
      let heading = screen.getByRole("heading", {
        name: /Register Now on Canonizer/i,
      });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText("Already have an account?")).toBeVisible();
      expect(screen.getByText("Log in Here")).toBeVisible();
      expect(screen.getByText(labels.firstName)).toBeInTheDocument();
      expect(screen.getByText(labels.lastName)).toBeInTheDocument();
      expect(screen.getByText(labels.email)).toBeInTheDocument();
      expect(screen.getByText(labels.phone)).toBeInTheDocument();
      expect(screen.getByText(labels.registrationPassword)).toBeInTheDocument();
      expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
    });
  });

  it("render inputs field and submit button", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const firstName = screen.getByLabelText(labels.firstName);
      const lastName = screen.getByLabelText(labels.lastName);
      const email = screen.getByLabelText(labels.email);
      const phone = screen.getByLabelText(labels.phone);
      const registrationPassword = screen.getByLabelText(
        labels.registrationPassword
      );
      const confirmPassword = screen.getByLabelText(labels.confirmPassword);

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
      expect(phone).toHaveAttribute("type", "number");
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
  });

  it("pass valid email to test email input field", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.email);
      userEvent.type(inputEl, "rahul.singh@iffort.com");
      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.email);
      userEvent.type(inputEl, "rahul.singhiffort.com");
      userEvent.tab();

      expect(
        screen.queryByText("The input is not valid E-mail!")
      ).toBeVisible();
    });
  });

  it("check phone number length is less than 9 chars", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.phone);
      userEvent.type(inputEl, "12345678");
      userEvent.tab();
      expect(inputEl).toHaveValue(12345678);
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.phoneMinLength)).toBeVisible();
    });
  });

  it("check phone number length should be min of 9 chars", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.phone);
      userEvent.type(inputEl, "123456789");
      expect(inputEl).toHaveValue(123456789);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("check password minimum length > 8", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.password);
      userEvent.type(inputEl, "1234567");
      userEvent.tab();
      expect(inputEl).toHaveValue("1234567");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText(
          "Password must be contain small, capital letter, number and special character like Abc@1234."
        )
      ).toBeVisible();
    });
  });

  it("pass valid password", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.password);
      userEvent.type(inputEl, "Abc@1234");
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.password);
      const inputEl2 = screen.getByLabelText(labels.confirmPassword);
      userEvent.type(inputEl, "Abc@1234");
      userEvent.type(inputEl2, "Abc@12344");
      userEvent.tab();
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("The two passwords that you entered do not match!")
      ).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const inputEl = screen.getByLabelText(labels.password);
      const inputEl2 = screen.getByLabelText(labels.confirmPassword);
      userEvent.type(inputEl, "Abc@1234");
      userEvent.type(inputEl2, "Abc@1234");

      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const btnEl = screen.getByTestId("submitButton");

      userEvent.click(btnEl);

      expect(screen.queryByText("Please input your first name!")).toBeVisible();
      expect(screen.queryByText("Please input your last name!")).toBeVisible();
      expect(screen.queryByText("Please input your E-mail!")).toBeVisible();
      expect(screen.queryByText("Please input your password!")).toBeVisible();
      expect(screen.queryByText("Please confirm your password!")).toBeVisible();
      expect(
        screen.queryByText("Please input the captcha you got!")
      ).toBeVisible();
    });
  });
  it("switches to OTP screen on successful registration", async () => {
    act(() => {
      jest.mock("src/network/api/userApi", () => ({
        register: jest.fn(() =>
          Promise.resolve({ status_code: 400, data: [] })
        ),
        verifyOtp: jest.fn(() =>
          Promise.resolve({ status_code: 400, data: [] })
        ),
        getCountryCodes: jest.fn(() =>
          Promise.resolve({ status_code: 400, data: [] })
        ),
        resendOTPForRegistration: jest.fn(() =>
          Promise.resolve({ status_code: 400, data: {} })
        ),
      }));
    });
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("submitButton"));
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();

    // const registerMock = jest
    //   .spyOn(
    //     {
    //       register: jest.fn(() =>
    //         Promise.resolve({ status_code: 400, data: [] })
    //       ),
    //     },
    //     "register"
    //   )
    //   .mockResolvedValue({
    //     status_code: 400,
    //     message: "Registration successful",
    //   });

    // await waitFor(() =>
    //   expect(screen.getByText("Registration successful")).toBeInTheDocument()
    // );
  });
});
