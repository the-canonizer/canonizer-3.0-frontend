import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import PageLoadingIndicator from "../";

// Mock router with event emitter functionality
function createMockRouter(): NextRouter & {
  triggerRouteChangeStart: () => void;
  triggerRouteChangeComplete: () => void;
  triggerRouteChangeError: () => void;
} {
  const eventHandlers: { [key: string]: Function[] } = {};

  const router = {
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
      on: jest.fn((event: string, handler: Function) => {
        if (!eventHandlers[event]) {
          eventHandlers[event] = [];
        }
        eventHandlers[event].push(handler);
      }),
      off: jest.fn((event: string, handler: Function) => {
        if (eventHandlers[event]) {
          eventHandlers[event] = eventHandlers[event].filter(
            (h) => h !== handler
          );
        }
      }),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    triggerRouteChangeStart: () => {
      eventHandlers["routeChangeStart"]?.forEach((handler) => handler("/test"));
    },
    triggerRouteChangeComplete: () => {
      eventHandlers["routeChangeComplete"]?.forEach((handler) =>
        handler("/test")
      );
    },
    triggerRouteChangeError: () => {
      eventHandlers["routeChangeError"]?.forEach((handler) =>
        handler(new Error("Route error"), "/test")
      );
    },
  } as NextRouter & {
    triggerRouteChangeStart: () => void;
    triggerRouteChangeComplete: () => void;
    triggerRouteChangeError: () => void;
  };

  return router;
}

afterEach(cleanup);

describe("PageLoadingIndicator", () => {
  it("should not render when not loading", () => {
    const mockRouter = createMockRouter();

    render(
      <RouterContext.Provider value={mockRouter}>
        <PageLoadingIndicator />
      </RouterContext.Provider>
    );

    expect(
      screen.queryByTestId("page-loading-indicator")
    ).not.toBeInTheDocument();
  });

  it("should render loading indicator when route change starts", () => {
    const mockRouter = createMockRouter();

    render(
      <RouterContext.Provider value={mockRouter}>
        <PageLoadingIndicator />
      </RouterContext.Provider>
    );

    act(() => {
      mockRouter.triggerRouteChangeStart();
    });

    expect(screen.getByTestId("page-loading-indicator")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should hide loading indicator when route change completes", () => {
    const mockRouter = createMockRouter();

    render(
      <RouterContext.Provider value={mockRouter}>
        <PageLoadingIndicator />
      </RouterContext.Provider>
    );

    act(() => {
      mockRouter.triggerRouteChangeStart();
    });

    expect(screen.getByTestId("page-loading-indicator")).toBeInTheDocument();

    act(() => {
      mockRouter.triggerRouteChangeComplete();
    });

    expect(
      screen.queryByTestId("page-loading-indicator")
    ).not.toBeInTheDocument();
  });

  it("should hide loading indicator when route change errors", () => {
    const mockRouter = createMockRouter();

    render(
      <RouterContext.Provider value={mockRouter}>
        <PageLoadingIndicator />
      </RouterContext.Provider>
    );

    act(() => {
      mockRouter.triggerRouteChangeStart();
    });

    expect(screen.getByTestId("page-loading-indicator")).toBeInTheDocument();

    act(() => {
      mockRouter.triggerRouteChangeError();
    });

    expect(
      screen.queryByTestId("page-loading-indicator")
    ).not.toBeInTheDocument();
  });

  it("should register and unregister event listeners", () => {
    const mockRouter = createMockRouter();

    const { unmount } = render(
      <RouterContext.Provider value={mockRouter}>
        <PageLoadingIndicator />
      </RouterContext.Provider>
    );

    expect(mockRouter.events.on).toHaveBeenCalledWith(
      "routeChangeStart",
      expect.any(Function)
    );
    expect(mockRouter.events.on).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );
    expect(mockRouter.events.on).toHaveBeenCalledWith(
      "routeChangeError",
      expect.any(Function)
    );

    unmount();

    expect(mockRouter.events.off).toHaveBeenCalledWith(
      "routeChangeStart",
      expect.any(Function)
    );
    expect(mockRouter.events.off).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );
    expect(mockRouter.events.off).toHaveBeenCalledWith(
      "routeChangeError",
      expect.any(Function)
    );
  });
});
