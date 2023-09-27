import ErrorBoundary from "../";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router"; // Import the useRouter hook

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

afterEach(cleanup);

function createMockRouter(router: Partial<NextRouter>): NextRouter {
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
    ...router,
  };
}
// const reloadPageMock = jest.fn();
// reloadPage.mockImplementation(reloadPageMock);

describe("Error Boundary", () => {
  it("should render without params", () => {
    const { container } = render(
      <ErrorBoundary>
        <h1>error</h1>
      </ErrorBoundary>
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render error", () => {
    const ThrowError = () => {
      throw new Error("Test");
    };
    const { container } = render(
      <ErrorBoundary>
        <RouterContext.Provider value={createMockRouter({ asPath: "/abcd" })}>
          <ThrowError />
        </RouterContext.Provider>
      </ErrorBoundary>
    );
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    const goBack = screen.getByRole("link", {
      name: "Click here",
    });
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    expect(container.getElementsByTagName("img")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        name: /oops!/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/to go back to the home page or wait five seconds\./i)
    ).toBeInTheDocument();
    expect(goBack).toBeInTheDocument();
    jest.useFakeTimers();
    jest.advanceTimersByTime(5000);
    expect(window.location.href).toBe("http://localhost/");
  });

  it("should render without crash", () => {
    const ThrowError = () => {
      throw new Error("Test");
    };
    const { container } = render(
      <ErrorBoundary>
        <RouterContext.Provider value={createMockRouter({ asPath: "/abcd" })}>
          <ThrowError />
        </RouterContext.Provider>
      </ErrorBoundary>
    );
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    const goBack = screen.getByRole("link", {
      name: "Click here",
    });
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    expect(container.getElementsByTagName("img")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        name: /oops!/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/to go back to the home page or wait five seconds\./i)
    ).toBeInTheDocument();
    expect(goBack).toBeInTheDocument();
    // window.location.reload = jest.fn();
    ErrorBoundary.getDerivedStateFromError({ name: "ChunkLoadError" });

    jest.useFakeTimers();
    jest.advanceTimersByTime(5000);

    // Ensure window.location.reload was called
    // expect(window.location.reload()).toHaveBeenCalled();
  });
});
