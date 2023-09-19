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
import Router, { NextRouter } from "next/router";

import Registration from "../emailPopup";
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
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByText(
        "Note: Your email address is not returned from social account. You have to enter the email address."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Social Email Confirmation")).toBeInTheDocument();
    userEvent.type(
      screen.getByPlaceholderText("Enter Email Address"),
      "text@gmail.com"
    );

    // Mock successful API response for SendOTPForVerify

    // Fill out email form and submit
    fireEvent.click(screen.getByTestId("submitButton"));

    // Wait for OTP screen to appear
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Enter OTP")).toBeInTheDocument()
    );

    // Verify that the API was called with the correct data
    // expect(sendOTPForVerifyMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     name: "jon",
    //   })
    // );
  });

  it("navigates to the appropriate route on successful OTP verification", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration isModal={false} />
        </RouterContext.Provider>
      </Provider>
    );

    // Mock successful API response for verifyEmailOnSocial

    // Fill out OTP form and submit
    // userEvent.type(screen.getByLabelText("OTP"), "123456");
    fireEvent.click(screen.getByTestId("submitButton"));

    // Wait for navigation or route push
    await waitFor(() => expect(Router.push).toHaveBeenCalled());

    // Verify that the API was called with the correct data
    // expect(verifyEmailOnSocialMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     email: "test@example.com",
    //     name: "John",
    //   })
    // );
  });
});
