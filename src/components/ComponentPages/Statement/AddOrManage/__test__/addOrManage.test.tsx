import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddOrManage from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

import configureMockStore from "redux-mock-store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

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
    query: {
      statement: ["2966-test-case", "1-Agreement"],
    },
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

// Mock the API functions used in the component
jest.mock("../../../../../network/api/campDetailApi", () => ({
  getAllUsedNickNames: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  getAllParentsCamp: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  getAllCampNickNames: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
  getCurrentTopicRecordApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: {} })
  ),
  getCampBreadCrumbApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
}));
jest.mock("../../../../../network/api/campManageStatementApi", () => ({
  getEditStatementApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: {} })
  ),
  getEditCampApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: {} })
  ),
  getEditTopicApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: {} })
  ),
  updateStatementApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
  updateTopicApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
  updateCampApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
}));
jest.mock("../../../../../network/api/homePageApi", () => ({
  getCanonizedNameSpacesApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
}));

describe("AddOrManage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("../../../../../network/api/campDetailApi", () => ({
      getCurrentTopicRecordApi: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: {} })
      ),
      getAllUsedNickNames: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getAllParentsCamp: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getAllCampNickNames: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getCampBreadCrumbApi: jest.fn(() =>
        Promise.resolve({ status_code: 200 })
      ),
    }));
    jest.mock("../../../../../network/api/campManageStatementApi", () => ({
      getEditStatementApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getParseCampStatementApi: jest.fn(() =>
        Promise.resolve({ status_code: 200 })
      ),
      getEditCampApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getEditTopicApi: jest.fn(() => Promise.resolve({ status_code: 200 })),
    }));
  });

  test("renders AddOrManage component", () => {
    render(
      <Provider store={store}>
        {" "}
        <AddOrManage add={true} />
      </Provider>
    );
  });

  test("submits the form with valid data", async () => {
    render(
      <Provider store={store}>
        {" "}
        <AddOrManage add={true} />
      </Provider>
    );
  });

  test("displays an error message for invalid data", async () => {
    render(
      <Provider store={store}>
        {" "}
        <AddOrManage add={true} />
      </Provider>
    );
  });
  it("Render without crash", async () => {
    const { container } = await render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/create/statement/2966-test-case/1-Agreement",
          })}
        >
          <AddOrManage add={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      const mainHeading = screen.getByText(/add camp statement/i);
      const submitButton = screen.getByRole("button", {
        name: /submit statement/i,
      });
      const cancelButton = screen.getByRole("button", {
        name: /cancel/i,
      });

      expect(screen.getByText(/nickname/i)).toBeInTheDocument();
      expect(screen.getAllByText(/statement/i)[1]).toBeInTheDocument();

      expect(screen.getByText(/edit summary/i).textContent).toBe(
        "Edit Summary (Briefly describe your changes)"
      );
      expect(
        screen.getByText(/\(briefly describe your changes\)/i)
      ).toBeInTheDocument();
      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(container.getElementsByTagName("input")).toHaveLength(1);
      expect(container.getElementsByTagName("textarea")).toHaveLength(1);
      expect(container.getElementsByTagName("a")).toHaveLength(0);

      expect(
        container.getElementsByClassName("wrapperClassName rdw-editor-wrapper")
      );
      expect(submitButton.textContent).toBe("Submit Statement");
      expect(cancelButton.textContent).toBe("Cancel");
      expect(mainHeading.textContent).toBe("Add Camp Statement");
    });
  });
});
