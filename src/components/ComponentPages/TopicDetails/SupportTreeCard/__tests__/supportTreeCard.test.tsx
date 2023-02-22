import SupportTreeCard from "../../../TopicDetails/SupportTreeCard/index";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
import { RouterContext } from "next/dist/shared/lib/router-context";

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

const handleLoadMoreSupporters = jest.fn();
const getCheckSupportStatus = {};
const removeSupport = jest.fn();
const fetchTotalScore = jest.fn();
const totalSupportScore = 0;
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
windowMatchMedia();
describe("SupportTreeCard on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <SupportTreeCard
            handleLoadMoreSupporters={handleLoadMoreSupporters}
            getCheckSupportStatus={getCheckSupportStatus}
            removeSupport={removeSupport}
            fetchTotalScore={fetchTotalScore}
            totalSupportScore={totalSupportScore}
          />
        </RouterContext.Provider>
      </Provider>
    );
  });
  it("show heading of supported camps", () => {
    const { getByText } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <SupportTreeCard
            handleLoadMoreSupporters={handleLoadMoreSupporters}
            getCheckSupportStatus={getCheckSupportStatus}
            removeSupport={removeSupport}
            fetchTotalScore={fetchTotalScore}
            totalSupportScore={totalSupportScore}
          />
        </RouterContext.Provider>
      </Provider>
    );

    // expect(container.getElementsByTagName("header")).toHaveLength(1);
    expect(
      getByText("Total Support for This Camp (including sub-camps):")
    ).toBeInTheDocument();
  });

  it("show heading of supported camps", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <SupportTreeCard
            handleLoadMoreSupporters={handleLoadMoreSupporters}
            getCheckSupportStatus={getCheckSupportStatus}
            removeSupport={removeSupport}
            fetchTotalScore={fetchTotalScore}
            totalSupportScore={totalSupportScore}
          />
        </RouterContext.Provider>
      </Provider>
    );

    // expect(container.getElementsByTagName("header")).toHaveLength(1);
    expect(container.getElementsByClassName("icon-info tooltip-icon-style"));
  });
});
