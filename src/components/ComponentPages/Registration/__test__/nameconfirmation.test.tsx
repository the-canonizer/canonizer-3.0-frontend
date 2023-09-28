import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import Registration from "../nameConfirmationPopup";
import { store } from "src/store";

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

jest.mock("src/network/api/userApi", () => ({
  resendOTPForRegistration: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  SendOTPForVerify: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  verifyEmailOnSocial: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
}));

describe("EmailPopup Component page", () => {
  it("shows OTP screen on successful email submission", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByText(
        "Note: Your name is not returned from your social account. You have to enter the name."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Name Confirmation")).toBeInTheDocument();
    userEvent.type(
      screen.getByPlaceholderText("Enter First Name"),
      "text@gmail.com"
    );
    userEvent.type(
      screen.getByPlaceholderText("Enter Last Name"),
      "text@gmail.com"
    );

    // Fill out email form and submit
    fireEvent.click(screen.getByTestId("submitButton"));

    // Wait for OTP screen to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
      expect(
        screen.getByText("One Time Verification Code")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Note: Verification code has been sent to your registered email address"
        )
      ).toBeInTheDocument();
      userEvent.type(screen.getByPlaceholderText("Enter OTP"), "123456");
      expect(screen.getByPlaceholderText("Enter OTP")).toHaveValue("123456");
      fireEvent.click(screen.getByTestId("submitButton"));
    });
  });
});
