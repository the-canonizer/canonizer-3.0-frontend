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
      getAllUsedNickNames: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getAllParentsCamp: jest.fn(() => Promise.resolve({ status_code: 200 })),
      getAllCampNickNames: jest.fn(() => Promise.resolve({ status_code: 200 })),
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
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({ asPath: "/manage/statement/3267" })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(() => {
      const mainHeading = screen.getByText(/statement update/i);
      const submitButton = screen.getByRole("button", {
        name: /submit update/i,
      });
      const previewButton = screen.getByRole("button", {
        name: /preview/i,
      });
      const createNewTopicButton = screen.getByRole("button", {
        name: /create new topic/i,
      });

      expect(screen.getByText(/nickname/i)).toBeInTheDocument();
      expect(screen.getAllByText(/statement/i)[1]).toBeInTheDocument();

      expect(
        screen.getByText(/\(briefly describe your changes\)/i)
      ).toBeInTheDocument();
      expect(container.getElementsByTagName("button")).toHaveLength(4);
      expect(container.getElementsByTagName("input")).toHaveLength(1);
      expect(
        container.getElementsByClassName("wrapperClassName rdw-editor-wrapper")
      );
      expect(submitButton.textContent).toBe("Submit Update");
      expect(previewButton.textContent).toBe("Preview");
      expect(createNewTopicButton.textContent).toBe("Create New Topic");
      expect(mainHeading.textContent).toBe("Statement Update");
    });
  });
});
