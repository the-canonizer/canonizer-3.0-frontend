import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";

import FeaturedTopics from "../index";
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

describe("FeaturedTopics", () => {
  test("renders SideBar component", () => {
    render(
      <Provider store={store}>
        <FeaturedTopics />
      </Provider>
    );
    expect(screen.getByText("FEATURED TOPICS")).toBeInTheDocument();
    expect(screen.getByText("FEATURED TOPICS")).toBeInTheDocument();
  });
});
