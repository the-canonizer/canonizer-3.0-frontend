import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";

import HomePageContainer from "../index";
import { store } from "src/store";

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

jest.mock("src/hooks/isUserAuthenticated", () => ({
  __esModule: true,
  default: jest.fn(() => ({ isUserAuthenticated: true })),
}));

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe("HomePageContainer", () => {
  test("renders SideBar component", () => {
    render(
      <Provider store={store}>
        <HomePageContainer />
      </Provider>
    );
    const sideBarElement = screen.getByTestId("sideBar");
    expect(sideBarElement).toBeInTheDocument();
  });

  test("renders TopicsList component", () => {
    render(
      <Provider store={store}>
        <HomePageContainer />
      </Provider>
    );
    const topicsListElement = screen.getByTestId("topicsList");
    expect(topicsListElement).toBeInTheDocument();
  });

  test("renders RecentActivities component when user is authenticated", () => {
    render(
      <Provider store={store}>
        <HomePageContainer />
      </Provider>
    );
    const recentActivitiesElement = screen.getByTestId("recentActivities");
    expect(recentActivitiesElement).toBeInTheDocument();
  });

  test("does not render RecentActivities component when user is not authenticated", () => {
    jest.mock("src/hooks/isUserAuthenticated", () => ({
      __esModule: true,
      default: jest.fn(() => ({ isUserAuthenticated: false })),
    }));

    render(
      <Provider store={store}>
        <HomePageContainer />
      </Provider>
    );
    const recentActivitiesElement = screen.queryByTestId("recentActivities");
    expect(recentActivitiesElement).toBeInTheDocument();
  });

  test("renders HelpCard component", () => {
    render(
      <Provider store={store}>
        <HomePageContainer />
      </Provider>
    );
    const helpCardElement = screen.getByTestId("helpCard");
    expect(helpCardElement).toBeInTheDocument();
  });
});
