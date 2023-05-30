
import { render, cleanup } from "@testing-library/react";
import Layout from "../index";
import { Provider } from "react-redux";
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

describe("Layout", () => {
  it("renders the correct header based on user authentication status", () => {
    const { container } = render(<Provider store={store}><Layout /></Provider>);
    const loggedInHeader = container.querySelector(".loggedInHeader");
    const loggedOutHeader = container.querySelector(".loggedOutHeader");
    expect(loggedInHeader).toBeDefined();
    expect(loggedOutHeader).toBeNull();
  });

  it("renders the child components", () => {
    const MockChild = () => <div>Mock Child Component</div>;
    const { getByText } = render(
        <Provider store={store}>
      <Layout>
        <MockChild />
      </Layout>
      </Provider>
    );
    const childComponent = getByText("Mock Child Component");
    expect(childComponent).toBeDefined();
  });
});
