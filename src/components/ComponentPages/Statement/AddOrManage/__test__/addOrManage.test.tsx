import AddOrManage from "..";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

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

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

afterEach(cleanup);
describe("Should render Addnews", () => {
  beforeEach(() => {
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
