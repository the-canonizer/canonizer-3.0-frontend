import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import TopicDetails from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

// Mock the useRouter hook
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { camp: ["1-agreement"] },
      asPath: "",
      push: jest.fn(),
      mockReset: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe("TopicDetails component", () => {
  test("renders TopicDetails component", () => {
    // Render the component
    const { getByText } = render(
      <Provider store={store}>
        {" "}
        <TopicDetails />
      </Provider>
    );
    expect(
      screen.getByRole("heading", {
        name: /consensus tree race/i,
      })
    ).toBeInTheDocument();
  });
});
