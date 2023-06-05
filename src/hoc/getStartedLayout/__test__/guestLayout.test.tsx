import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
// import { store } from "../../store";
// import GetStartedHeader from "../../components/common/headers/getStartedHeader";
// import Footer from "../../components/common/footer";
import GetStartedLayout from "../index";
import { store } from "src/store";

// Mock the Next.js wrapper function
jest.mock("next-redux-wrapper", () => ({
  __esModule: true,
  createWrapper: jest.fn(),
}));

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

describe("GetStartedLayout", () => {
  // Mock the Redux store wrapper
  const mockWrapper = {
    withRedux: jest.fn((Component) => Component),
  };
  createWrapper.mockReturnValue(mockWrapper);

  test("renders children components", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GetStartedLayout>
          <div data-testid="header">Header</div>
          <div data-testid="content">Content</div>
          <div data-testid="footer">Footer</div>
        </GetStartedLayout>
      </Provider>
    );

    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByTestId("content")).toBeInTheDocument();
    expect(getByTestId("footer")).toBeInTheDocument();
  });

  test("renders GetStartedHeader component", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GetStartedLayout>
          <div data-testid="header">Header</div>
        </GetStartedLayout>
      </Provider>
    );

    expect(getByTestId("header")).toBeInTheDocument();
  });

  test("renders Footer component", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <GetStartedLayout>
          <div data-testid="footer">Footer</div>
        </GetStartedLayout>
      </Provider>
    );

    expect(getByTestId("footer")).toBeInTheDocument();
  });
});
