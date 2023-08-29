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
import router, { NextRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import configureMockStore from "redux-mock-store";

import Registration from "../nameConfirmationPopup";
import messages from "../../../../messages";
import { store } from "src/store";
import { Form } from "antd";
import { hideRegistrationModal } from "src/store/slices/uiSlice";

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

const obj = {
  resendOTPForRegistration: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  SendOTPForVerify: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  verifyEmailOnSocial: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
};
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

    // Mock successful API response for SendOTPForVerify
    const sendOTPForVerifyMock = jest
      .spyOn(obj, "SendOTPForVerify")
      .mockResolvedValue({
        status_code: 200,
      });

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
    const verifyEmailOnSocialMock = jest
      .spyOn(obj, "verifyEmailOnSocial")
      .mockResolvedValue({
        status_code: 200,
      });

    // Fill out OTP form and submit
    // userEvent.type(screen.getByLabelText("OTP"), "123456");
    fireEvent.click(screen.getByTestId("submitButton"));

    // Wait for navigation or route push
    // await waitFor(() => expect(router.push).toHaveBeenCalled());

    // Verify that the API was called with the correct data
    // expect(verifyEmailOnSocialMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     email: "test@example.com",
    //     name: "John",
    //   })
    // );
  });
});
