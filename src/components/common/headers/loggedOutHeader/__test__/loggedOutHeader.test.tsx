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
    const logoLink = screen.getAllByRole("link", {
      name: /Picture of the author/i,
    });
    const browseLink = screen.getByRole("link", {
      name: /Browse/i,
    });
    // const uploadFilesLink = screen.getByRole("link", {
    //   name: /Upload File/i,
    // });

    const helpLink = screen.getByRole("link", {
      name: /Help/i,
    });

    const whitePaperLink = screen.getByRole("link", {
      name: /White Paper/i,
    });
    const blogLink = screen.getByText(/blog/i);
    const jobsLink = screen.getByRole("link", {
      name: /Jobs/i,
    });

    expect(container.getElementsByTagName("header")).toHaveLength(1);
    expect(container.getElementsByTagName("nav")).toHaveLength(1);
    expect(container.getElementsByTagName("ul")).toHaveLength(1);
    expect(container.getElementsByTagName("li")).toHaveLength(5);
    expect(container.getElementsByTagName("a")).toHaveLength(7);
    expect(container.getElementsByTagName("button")).toHaveLength(8);
    expect(container.getElementsByTagName("img")).toHaveLength(2);
    expect(logoLink).toHaveLength(2);
    expect(logoLink[0].getAttribute("href")).toBe("/");
    expect(logoLink[1].getAttribute("href")).toBe("/");
    expect(browseLink.getAttribute("href")).toBe("/browse");
    // expect(uploadFilesLink.getAttribute("href")).toBe("/uploadFile");
    expect(helpLink.getAttribute("href")).toBe("/topic/132-Help/1-Agreement");
    expect(whitePaperLink.getAttribute("href")).toBe(
      "/files/2012_amplifying_final.pdf"
    );
    expect(blogLink).toBeInTheDocument();
    expect(jobsLink.getAttribute("href")).toBe(
      "/topic/6-Canonizer-Jobs/1-Agreement"
    );
  });
});
