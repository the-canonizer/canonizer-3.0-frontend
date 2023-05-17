import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import { Provider } from "react-redux";

import { windowMatchMedia } from "../../../../../utils/testUtils";
import { store } from "../../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import TimelineSlider from "../../timelineSlider";
import { NextRouter } from "next/router";

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
  it("Render without crash", async () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/eventline/1245-test-event-topic/2-camp-122",
          })}
        >
          <TimelineSlider
            mockData={{
              asoftime_1683285264: {
                event: {
                  message: "latest timeline created",
                  type: "event_timeline",
                  id: 1245,
                  old_parent_id: null,
                  new_parent_id: null,
                  nickname_id: 4,
                },
                payload_response: [
                  {
                    topic_id: 1245,
                    level: 1,
                    camp_id: 1,
                    camp_name: "Agreement",
                    title: "test event topic",
                    score: 1,
                    full_score: 1,
                    submitter_nick_id: 4,
                  },
                ],
              },
              asoftime_1683280316: {
                event: {
                  message: "Andrea_Allsop created New Topic test event topic",
                  type: "create_topic",
                  id: "1898",
                  old_parent_id: "",
                  new_parent_id: "",
                  nickname_id: 4,
                },
                payload_response: [
                  {
                    topic_id: 1245,
                    level: 1,
                    camp_id: 1,
                    camp_name: "Agreement",
                    title: "test event topic",
                    score: 1,
                    full_score: 1,
                    submitter_nick_id: 4,
                  },
                ],
              },
            }}
            start={false}
            animationSpeed={1000}
            iteration={0}
            isPlaying={false}
            setTimelineDescript={jest.fn()}
            handleEventSelection={jest.fn()}
            setAnimationSpeed={jest.fn()}
            setIteration={jest.fn()}
            handleForwardOrBackord={jest.fn()}
            setIsPlaying={jest.fn()}
            setStart={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );
    // const a = screen.getByRole("button", {
    //   name: /arrow\-left/i,
    // });
    expect(
      screen.getByRole("img", {
        name: "step-backward",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "step-forward",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "caret-right",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "dashboard",
      })
    ).toBeInTheDocument();

    const date = screen.getAllByText(/may 5,2023/i);
    expect(date).toHaveLength(2);
  });
});
