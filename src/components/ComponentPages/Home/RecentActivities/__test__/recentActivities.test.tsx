import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";

import RecentActivities from "../";
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

describe("RecentActivities", () => {
  test("renders SideBar component", () => {
    render(
      <Provider store={store}>
        <RecentActivities isUserAuthenticated={undefined} />
      </Provider>
    );
    expect(screen.getByText("Recent activities")).toBeInTheDocument();
    expect(screen.getByText("See More")).toBeInTheDocument();
  });
});
