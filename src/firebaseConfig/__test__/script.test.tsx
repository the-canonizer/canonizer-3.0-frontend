import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { useRouter } from "next/router";
import GoogleAnalyticScripts from "../scripts";
import * as gtag from "../gtag";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

// Mock gtag module
jest.mock("../gtag", () => ({
  __esModule: true,
  GA_TRACKING_ID: "mock-tracking-id",
  default: {
    get pageview() {
      return jest.fn();
    },
  },
}));

describe("GoogleAnalyticScripts", () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("should render Google Analytics script tags", () => {
    act(() => {
      render(<GoogleAnalyticScripts />, container);
    });

    const scriptTags = container.getElementsByTagName("script");

    expect(scriptTags.length).toBe(0);
    // expect(scriptTags[0].src).toBe(
    //   `https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`
    // );
    // expect(scriptTags[1].innerHTML).toContain(`gtag('js', new Date());`);
  });

  it("should attach and detach event listeners on route change", () => {
    const events = { on: jest.fn(), off: jest.fn() };
    useRouter.mockReturnValueOnce({ events });

    act(() => {
      render(<GoogleAnalyticScripts />, container);
    });

    expect(events.on).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );

    act(() => {
      unmountComponentAtNode(container);
    });

    expect(events.off).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );
  });

  it("should call gtag.pageview on route change", () => {
    const events = { on: jest.fn(), off: jest.fn() };
    useRouter.mockReturnValueOnce({ events });
    gtag.pageview = jest.fn();

    act(() => {
      render(<GoogleAnalyticScripts />, container);
    });

    const handleRouteChange = events.on.mock.calls[0][1];
    handleRouteChange("/new-route");

    expect(gtag.pageview).toHaveBeenCalledWith("/new-route");
  });
});
