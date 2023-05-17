const CampTreeCard = dynamic(() => import("../"), { ssr: false });
import { cleanup, render } from "@testing-library/react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue({
    asPath: "/topic/",
  }),
}));

function createMockRouter(router: Partial<NextRouter>, asPath): any {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath,
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

describe("Camp tree card on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({}, "/topic/")}>
          <CampTreeCard
            getTreeLoadingIndicator={undefined}
            scrollToCampStatement={undefined}
            setTotalCampScoreForSupportTree={undefined}
            setSupportTreeForCamp={undefined}
          />
        </RouterContext.Provider>
      </Provider>
    );
  });
});
