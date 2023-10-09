import LoggedInHeaderNavigation from "../index";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import configureMockStore from "redux-mock-store";
function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "",
    route: "/",
    query: {
      from: "notify_11337",
      camp: ["2991-randomize"],
    },
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

afterEach(cleanup);
// const payload = {
//   camp_num: 1,
//   topic_num: 88,
// };

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  notifications: {
    data: [],
    headerNotification: {
      list: [
        {
          id: 11338,
          user_id: 1394,
          topic_num: 2991,
          camp_num: 1,
          notification_type: "Camp",
          message_body:
            "Sajid-Dev has just proposed a change to - Agreement camp.",
          fcm_token: null,
          is_read: 0,
          created_at: 1695802964,
          updated_at: 1695802964,
          message_title: "Proposed a change to camp - Agreement.",
          message_response: null,
          thread_id: null,
          is_seen: 0,
          seen_time: null,
          url: "http://localhost:4000/camp/history/2991-randomize/1-Agreement",
        },
        {
          id: 11337,
          user_id: 1394,
          topic_num: 2991,
          camp_num: 1,
          notification_type: "Topic",
          message_body:
            "Sajid-Dev has just proposed a change to - randomize topic.",
          fcm_token: null,
          is_read: 0,
          created_at: 1695802949,
          updated_at: 1695802949,
          message_title: "Proposed a change to topic - randomize.",
          message_response: null,
          thread_id: null,
          is_seen: 0,
          seen_time: null,
          url: "http://localhost:4000/topic/history/2991-randomize",
        },
      ],
    },
  },
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
      asof: "default",
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

const store2 = mockStore({
  auth: {
    authenticated: false,
    loggedInUser: {
      is_admin: false,
    },
  },
  notifications: {
    headerNotification: {
      list: [],
    },
  },

  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
});

describe("Camp statement on camp details page", () => {
  it("Should render without crash", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath:
              "/topic/88-Mind-and-Consciousness-revie/1-Agreement?from=notify_11335",
            query: {
              from: "notify_11337",
              camp: ["2991-randomize"],
            },
          })}
        >
          <LoggedInHeaderNavigation />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByRole("link", {
        name: /svg create topic/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /browse/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /help/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /setting account settings/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /check-circle supported camps/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /menu/i,
      })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/log out/i));
  });

  it("Should render without crash topic", async () => {
    render(
      <Provider store={store2}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
          })}
        >
          <LoggedInHeaderNavigation isLoginPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByRole("link", {
        name: /svg create topic/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /browse/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /help/i,
      })
    ).toBeInTheDocument();
  });
});
