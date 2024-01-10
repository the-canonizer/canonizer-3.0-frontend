import { render, screen, fireEvent } from "@testing-library/react";
import TimelineSlider from "../../eventLine/TimelineSlider";
import TimeLine from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

import configureMockStore from "redux-mock-store";

const mockDataAll = {
  asoftime_1159293015_1: {
    event: {
      message: "Event 1",
      id: 1,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1160967939_2: {
    event: {
      message: "Event 2",

      id: 52,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_removed",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1163361514_3: {
    event: {
      message: "Event 3",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1164361514_3: {
    event: {
      message: "Event 4",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1165361514_3: {
    event: {
      message: "Event 5",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
    asoftime_1166361514_3: {
      event: {
        message: "Event 7",
        id: 2,
        namespaceId: 1,
        new_parent_id: null,
        nickname_id: 96,
        old_parent_id: null,
        type: "direct_support_added",
        url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
        url_new: null,
      },
      asoftime_1167361514_3: {
        event: {
          message: "Event 8",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1168361514_3: {
        event: {
          message: "Event 9",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
    },
  },
};

const mockStore = configureMockStore();
const store1 = mockStore({
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 19,
      asofdate: 1693720277.174,
      asof: "bydate",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
    selectedCampNode: {
      topic_id: 88,
      camp_id: 1,
      title: "Mind and Consciousness revie",
      review_title: "Mind and Consciousness revie",
      link: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
      review_link: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
      score: 65.004,
      full_score: 91,
      submitter_nick_id: 592,
      created_date: 1228141435,
      is_valid_as_of_time: true,
      is_disabled: 0,
      is_one_level: 0,
      is_archive: 0,
      direct_archive: 0,
    },
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});
// Mock the API response for getEventLineApi
jest.mock("src/network/api/topicEventLineAPI", () => ({
  getEventLineApi: jest.fn().mockResolvedValue({
    // Mocked response data
    data: {
      asoftime_1159293015_1: {
        event: {
          message: "Event 1",
          id: 1,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1160967939_2: {
        event: {
          message: "Event 2",

          id: 52,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_removed",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1163361514_3: {
        event: {
          message: "Event 3",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1164361514_3: {
        event: {
          message: "Event 4",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1165361514_3: {
        event: {
          message: "Event 5",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
        asoftime_1166361514_3: {
          event: {
            message: "Event 7",
            id: 2,
            namespaceId: 1,
            new_parent_id: null,
            nickname_id: 96,
            old_parent_id: null,
            type: "direct_support_added",
            url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
            url_new: null,
          },
          asoftime_1167361514_3: {
            event: {
              message: "Event 8",
              id: 2,
              namespaceId: 1,
              new_parent_id: null,
              nickname_id: 96,
              old_parent_id: null,
              type: "direct_support_added",
              url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
              url_new: null,
            },
          },
          asoftime_1168361514_3: {
            event: {
              message: "Event 9",
              id: 2,
              namespaceId: 1,
              new_parent_id: null,
              nickname_id: 96,
              old_parent_id: null,
              type: "direct_support_added",
              url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
              url_new: null,
            },
          },
        },
      },
    },
    code: 200,
    success: true,
  }),
}));

describe("TimelineSlider", () => {
  test("renders the component with correct props", () => {
    const mockData = mockDataAll;
    const setStart = jest.fn();
    const setTimelineDescript = jest.fn();
    const handleEventSelection = jest.fn();
    const setAnimationSpeed = jest.fn();
    const setIteration = jest.fn();
    const handleForwardOrBackord = jest.fn();
    const setIsPlaying = jest.fn();

    render(
      <TimelineSlider
        mockData={mockData}
        setStart={setStart}
        start={false}
        setTimelineDescript={setTimelineDescript}
        handleEventSelection={handleEventSelection}
        animationSpeed={1000}
        setAnimationSpeed={setAnimationSpeed}
        iteration={0}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={false}
        setIsPlaying={setIsPlaying}
      />
    );

    expect(screen.getByTestId("time-bar-control")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("play-button"));
  });
  test("renders the component with correct data", async () => {
    render(
      <Provider store={store1}>
        <TimeLine
          setTimelineDescript={jest.fn()}
          setLoadingEvents={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByTestId("time-bar-control")).toBeInTheDocument();
  });
});

describe("TimeLine", () => {
  test("renders the component with correct data", async () => {
    render(
      <Provider store={store}>
        {" "}
        <TimeLine
          setTimelineDescript={jest.fn()}
          setLoadingEvents={jest.fn()}
        />
      </Provider>
    );
    expect(screen.getByTestId("time-bar-control")).toBeInTheDocument();
  });
});
