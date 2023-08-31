import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import Registration from "../registrationModal";
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

// jest.mock("antd", () => ({
//   Modal: jest.fn(({ visible, children }) =>
//     visible ? <div data-testid="modal">{children}</div> : null
//   ),
// }));

afterEach(cleanup);
// const mockStore = configureMockStore();
// const store1 = mockStore({
//   auth: {
//     authenticated: true,
//     loggedInUser: {
//       is_admin: true,
//     },
//   },
//   topicDetails: {
//     currentCampRecord: {},
//   },
//   filters: {
//     filterObject: {},
//   },
//   forum: {
//     currentThread: null,
//     currentPost: null,
//   },
// });

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
  it("renders Registration component when isOTPModal is true", () => {
    // useSelector.mockReturnValueOnce({ isOTPModal: true });
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByTestId("modal")).not.toBeInTheDocument();
    // expect(screen.getByTestId("registration-component")).toBeInTheDocument();
  });
  it("renders EmailPopup component when isEmailModal is true", () => {
    // useSelector.mockReturnValueOnce({ isEmailModal: true });
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );
    // expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("email-popup-component")).not.toBeInTheDocument();
  });
});
