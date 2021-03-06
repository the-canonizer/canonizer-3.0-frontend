import LoggedOutHeader from "../";
import { cleanup, getByRole, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
windowMatchMedia();

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

afterEach(cleanup);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("LoggedOutHeader", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <LoggedOutHeader />
        </RouterContext.Provider>
      </Provider>
    );
    const logoLink = screen.getByRole("link", {
      name: /Picture of the author/i,
    });
    const browseLink = screen.getByRole("link", {
      name: /Browse/i,
    });
    const uploadFilesLink = screen.getByRole("link", {
      name: /Upload File/i,
    });

    const helpLink = screen.getByRole("link", {
      name: /Help/i,
    });

    const whitePaperLink = screen.getByRole("link", {
      name: /White Paper/i,
    });
    const blogLink = screen.getByRole("link", {
      name: /Blog/i,
    });
    const jobsLink = screen.getByRole("link", {
      name: /Jobs/i,
    });

    expect(container.getElementsByTagName("header")).toHaveLength(1);
    expect(container.getElementsByTagName("nav")).toHaveLength(1);
    expect(container.getElementsByTagName("ul")).toHaveLength(1);
    expect(container.getElementsByTagName("li")).toHaveLength(6);
    expect(container.getElementsByTagName("a")).toHaveLength(8);
    expect(container.getElementsByTagName("button")).toHaveLength(8);
    expect(container.getElementsByTagName("img")).toHaveLength(1);

    expect(logoLink.getAttribute("href")).toBe("/");
    expect(browseLink.getAttribute("href")).toBe("/browse");
    expect(uploadFilesLink.getAttribute("href")).toBe("/uploadFile");
    expect(helpLink.getAttribute("href")).toBe("/help");
    expect(whitePaperLink.getAttribute("href")).toBe("/white-paper");
    expect(blogLink.getAttribute("href")).toBe("/blog");
    expect(jobsLink.getAttribute("href")).toBe("/jobs");
  });
});
