import AddOrManage from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

function createMockRouter(): NextRouter {
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
describe("Should render Addnews", () => {
  it("Render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    const submitButton = screen.getByRole("button", {
      name: /submit update/i,
    });
    const previewButton = screen.getByRole("button", {
      name: /preview/i,
    });

    expect(container.getElementsByTagName("button")).toHaveLength(3);
    expect(container.getElementsByTagName("textarea")).toHaveLength(2);

    expect(screen.getByText("Nick Name")).toBeInTheDocument();
    expect(screen.getByText("Edit Summary")).toBeInTheDocument();
    expect(
      screen.getByText("(Briefly describe your changes)")
    ).toBeInTheDocument();

    expect(submitButton.textContent).toBe("Submit Update");
    expect(previewButton.textContent).toBe("Preview");
    expect(screen.getByText(/topic update/i)).toBeInTheDocument();
  });
});
