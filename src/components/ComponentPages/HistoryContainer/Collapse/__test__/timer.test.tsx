import {
  fireEvent,
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
      <Timer unixTime={1698680436} setCommited={jest.fn()} />
    );
    // debug();
    await waitFor(() => {
      //   const timerText = screen.getByText(/00:59:59/);
      //   expect(timerText).toBeInTheDocument();
    });
  });
  test("renders initial time", async () => {
    const { container, debug } = render(
      <Timer unixTime={1698676800} setCommited={jest.fn()} />
    );
    debug();
    await waitFor(() => {
      const timerText = screen.getByText("00:59:59");
      expect(timerText).toBeInTheDocument();
    });
  });
  //   it("renders with default time (00:00:00)", () => {
  //     const { container, debug } = render(<Timer unixTime={0} />);
  //     const timerText = container.querySelector("span");
  //     debug();
  //     expect(timerText).toHaveTextContent("00:00:00");
  //   });

  //   it("renders with a specific time (02:30:45)", async () => {
  //     const { container } = render(<Timer unixTime={9045 * 1000} />);
  //     const timerText = container.querySelector("span");

  //     // Wait for the component to re-render and update
  //     await waitFor(() => {
  //       expect(timerText).toHaveTextContent("02:30:45");
  //     });
  //   });

  //   it("renders with a time that exceeds 24 hours (27:45:15)", () => {
  //     const { container } = render(<Timer unixTime={99915 * 1000} />);
  //     const timerText = container.querySelector("span");
  //     expect(timerText).toHaveTextContent("27:45:15");
  //   });

  //   // Add more test cases as needed

  //   it("renders with negative time (-01:30:15)", () => {
  //     const { container } = render(<Timer unixTime={-5415 * 1000} />);
  //     const timerText = container.querySelector("span");
  //     expect(timerText).toHaveTextContent("-01:30:15");
  //   });
});
