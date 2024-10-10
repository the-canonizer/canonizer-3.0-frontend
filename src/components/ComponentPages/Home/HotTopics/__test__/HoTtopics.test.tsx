import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";

import HotTopics from "../index";
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

describe("HotTopics", () => {
  test("renders SideBar component", () => {
    render(
      <Provider store={store}>
        <HotTopics />
      </Provider>
    );
    expect(screen.getByText("Hot Topics")).toBeInTheDocument();
    expect(screen.getByText("See More")).toBeInTheDocument();
  });
});
