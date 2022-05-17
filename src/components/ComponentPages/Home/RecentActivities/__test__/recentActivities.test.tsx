import RecentActivities from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import exp from "constants";

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

// router.asPath !== "/activities"
afterEach(cleanup);
windowMatchMedia();

describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", () => {
    act(() => {
      const { container } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({ asPath: "/activities" })}
          >
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );
      const mainHeadig = screen.getByRole("heading", {
        name: /recent activities/i,
      });
      const topictab = screen.getByRole("tab", {
        name: /topics\/camps/i,
      });
      const threadtab = screen.getByRole("tab", {
        name: /threads/i,
      });
      const loadmorebutton = screen.getByRole("button", {
        name: /load more topics !/i,
      });
      expect(container.getElementsByTagName("li")).toHaveLength(15);
      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(mainHeadig.textContent).toBe("Recent Activities");
      expect(topictab.textContent).toBe("Topics/Camps");
      expect(threadtab.textContent).toBe("Threads");
      expect(loadmorebutton.textContent).toBe("Load More topics !");

      // when asPath "/" then use this

      // const mainHeadig = screen.getByRole("heading", {
      //   name: /recent activities/i,
      // });
      // const topictab = screen.getByRole("tab", {
      //   name: /topics\/camps/i,
      // });
      // const threadtab = screen.getByRole("tab", {
      //   name: /threads/i,
      // });

      // expect(container.getElementsByTagName("button")).toHaveLength(1);

      // expect(mainHeadig.textContent).toBe("Recent Activities");

      // expect(topictab.textContent).toBe("Topics/Camps");

      // expect(threadtab.textContent).toBe("Threads");
      // expect(screen.getByText(/view all topics/i)).toBeInTheDocument();
    });
  });
});
