import { render, screen, cleanup } from "@testing-library/react";
import WithoutSidebarLayout from "../index";
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

describe("WithoutSidebarLayout", () => {
  test("renders LoggedInHeader when user is authenticated", () => {
    const isUserAuthenticated = true;
    render(<Provider store={store}><WithoutSidebarLayout isUserAuthenticated={isUserAuthenticated} /></Provider>);
    
    const loggedInHeaderElement = screen.getByTestId("loggedInHeader");
    expect(loggedInHeaderElement).toBeInTheDocument();
  });

  test("renders LoggedOutHeader when user is not authenticated", () => {
    const isUserAuthenticated = false;
    render(<Provider store={store}><WithoutSidebarLayout isUserAuthenticated={isUserAuthenticated} /></Provider>);
    
    const loggedOutHeaderElement = screen.getByTestId("loggedOutHeader");
    expect(loggedOutHeaderElement).toBeInTheDocument();
  });

  test("renders children content", () => {
    const isUserAuthenticated = true;
    const childrenContent = "Test Children Content";
    render(<Provider store={store}>
      <WithoutSidebarLayout isUserAuthenticated={isUserAuthenticated}>
        {childrenContent}
      </WithoutSidebarLayout>
      </Provider>
    );
    
    const childrenContentElement = screen.getByText(childrenContent);
    expect(childrenContentElement).toBeInTheDocument();
  });

  
});
