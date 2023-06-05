import CampTreeCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";

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

describe("Camp tree card on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <CampTreeCard />
        </RouterContext.Provider>
      </Provider>
    );
  });
});
