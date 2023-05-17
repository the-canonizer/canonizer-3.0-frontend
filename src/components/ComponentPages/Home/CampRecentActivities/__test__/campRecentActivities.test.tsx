import CampRecentActivities from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "src/store";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue({ aspath: "" }),
}));

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

function createMockRouter(router: Partial<NextRouter>): any {
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
describe("Should render Addnews", () => {
  it("Render without crash", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/topic/history/88-Theories-of-Consciousness",
          })}
        >
          <CampRecentActivities />{" "}
        </RouterContext.Provider>
      </Provider>
    );
    const userList = await waitFor(() =>
      screen.getByText(/No Recent Activity Found/i)
    );
    expect(screen.getByText(/recent activities/i)).toBeInTheDocument();
    expect(userList).toBeInTheDocument();
  });
});
