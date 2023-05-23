import SupportTreeCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

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
windowMatchMedia();
describe("SupportTreeCard on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/topic/",
          })}
        >
          <SupportTreeCard />
        </RouterContext.Provider>
      </Provider>
    );
  });
});
