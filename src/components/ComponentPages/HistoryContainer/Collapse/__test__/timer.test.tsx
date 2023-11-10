import {
  fireEvent,
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import HistoryCollapse, { Timer } from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";

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

describe("HistoryCollapse component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1698680495 * 1000).getTime());
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  test("renders commit and cancel button", async () => {
    const { container, debug } = render(
      <Timer unixTime={1698680495} setCommited={jest.fn()} />
    );
    const timerText = container.querySelector("span");

    expect(timerText).toHaveTextContent("01:00:00");
    jest.advanceTimersByTime(1001);

    expect(timerText).toHaveTextContent("00:59:59");
    act(() => {
      jest.advanceTimersByTime(3543000);
    });

    expect(timerText).toHaveTextContent("00:01:00");
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(timerText).toHaveTextContent("00:00:59");
    act(() => {
      jest.advanceTimersByTime(58000);
    });

    expect(timerText).toHaveTextContent("00:00:01");
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(timerText).toHaveTextContent("00:00:00");
    act(() => {
      jest.advanceTimersByTime(1001);
    });
  });
  it("renders with default time (00:00:00)", () => {
    const { container, debug } = render(<Timer unixTime={0} />);
    const timerText = container.querySelector("span");

    expect(timerText).toHaveTextContent("00:00:00");
  });
});
