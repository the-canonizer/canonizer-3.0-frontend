import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";

import Registration from "../registrationModal";

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
  ui: {
    registrationModalVisible: true,
    showSocialLoginEmailPopup: true,
    showSocialLoginNamePopup: true,
  },
  utils: {
    social_login_keys: "sksajh",
  },
});

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
  getCountryCodes: jest.fn(() =>
    Promise.resolve({
      status_code: 200,
      data: [
        { id: 1, phone_code: "+91", country_code: "IN" },
        { id: 2, phone_code: "+1", country_code: "USA" },
      ],
    })
  ),
}));

describe("EmailPopup Component page", () => {
  it("renders Registration component when isOTPModal is true", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <Registration />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByTestId("regiPop")).toBeInTheDocument();
    expect(screen.getByTestId("emailpopup")).toBeInTheDocument();
    expect(screen.getByTestId("nameconfirmation")).toBeInTheDocument();
  });
});
