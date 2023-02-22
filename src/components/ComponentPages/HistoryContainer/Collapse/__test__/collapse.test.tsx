import HistoryCollapse from "..";
import { render, cleanup, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

function createMockRouter() {
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
  };
}

afterEach(cleanup);

describe("CampHistory Page", () => {
  it("should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <HistoryCollapse />
        </RouterContext.Provider>
      </Provider>
    );
  });
});
