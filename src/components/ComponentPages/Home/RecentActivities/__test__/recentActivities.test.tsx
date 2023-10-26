import RecentActivities from "../";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { setTopics } from "../../../../../store/slices/recentActivitiesSlice";
// import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
import configureMockStore from "redux-mock-store";

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

afterEach(cleanup);
windowMatchMedia();

const mocktopic = {
  items: [
    {
      id: 12097,
      activity_id: 15153,
      user_id: 1394,
      viewed: 0,
      created_at: 1693834869,
      updated_at: 1693834869,
      activity: {
        id: 15153,
        log_name: "topic/camps",
        description: "Sajid-Dev proposed a change to the camp",
        subject_type: "App\\Models\\Camp",
        subject_id: 10904,
        causer_type: "App\\Models\\User",
        causer_id: 1394,
        properties:
          '{"url": "/camp/history/350/1", "camp_num": 1, "camp_name": "Agreement", "topic_num": 350, "topic_name": "test updated 2 dec 2021", "description": null, "thread_name": null}',
        created_at: 1693834869,
        updated_at: 1693834869,
      },
    },
    {
      id: 12016,
      activity_id: 15115,
      user_id: 1394,
      viewed: 0,
      created_at: 1692613864,
      updated_at: 1692613864,
      activity: {
        id: 15115,
        log_name: "topic/camps",
        description: "Evil-Tester587 proposed a change to the camp",
        subject_type: "App\\Models\\Camp",
        subject_id: 10897,
        causer_type: "App\\Models\\User",
        causer_id: 1336,
        properties:
          '{"url": "/camp/history/2971/2", "camp_num": 2, "camp_name": "camp 1", "topic_num": 2971, "topic_name": "test 0021", "description": null}',
        created_at: 1692613864,
        updated_at: 1692613864,
      },
    },
    {
      id: 12015,
      activity_id: 15114,
      user_id: 1394,
      viewed: 0,
      created_at: 1692613711,
      updated_at: 1692613711,
      activity: {
        id: 15114,
        log_name: "topic/camps",
        description: "Sajid-Dev objected a change to statement",
        subject_type: "App\\Models\\Statement",
        subject_id: 6093,
        causer_type: "App\\Models\\User",
        causer_id: 1394,
        properties:
          '{"url": "/statement/history/2971/2", "camp_num": 2, "topic_num": 2971, "topic_name": null, "description": "<p>camp 1 camp a</p>"}',
        created_at: 1692613711,
        updated_at: 1692613711,
      },
    },
    {
      id: 12014,
      activity_id: 15113,
      user_id: 1394,
      viewed: 0,
      created_at: 1692613681,
      updated_at: 1692613681,
      activity: {
        id: 15113,
        log_name: "topic/camps",
        description: "Evil-Tester587 proposed a change to the statement",
        subject_type: "App\\Models\\Statement",
        subject_id: 6093,
        causer_type: "App\\Models\\User",
        causer_id: 1336,
        properties:
          '{"url": "/statement/history/2971/2", "camp_num": 2, "camp_name": "camp 1", "topic_num": 2971, "topic_name": "test 0021", "description": "<p>camp 1 camp a</p>"}',
        created_at: 1692613681,
        updated_at: 1692613681,
      },
    },
  ],
  current_page: 1,
  per_page: 15,
  last_page: 5,
  total_rows: 66,
  from: 1,
  to: 15,
};
// const mocktopic2 = {
//   items: [
//     {
//       id: 12015,
//       activity_id: 15114,
//       user_id: 1394,
//       viewed: 0,
//       created_at: 1692613711,
//       updated_at: 1692613711,
//       activity: {
//         id: 15114,
//         log_name: "topic/camps",
//         description: "wahaj-dev objected a change to statement",
//         subject_type: "App\\Models\\Statement",
//         subject_id: 6093,
//         causer_type: "App\\Models\\User",
//         causer_id: 1394,
//         properties:
//           '{"url": "/statement/history/2971/2", "camp_num": 2, "topic_num": 2971, "topic_name": null, "description": "<p> camp a</p>"}',
//         created_at: 1692613711,
//         updated_at: 1692613711,
//       },
//     },
//     {
//       id: 12014,
//       activity_id: 15113,
//       user_id: 1394,
//       viewed: 0,
//       created_at: 1692613681,
//       updated_at: 1692613681,
//       activity: {
//         id: 15113,
//         log_name: "topic/camps",
//         description: "Evil-Tester577 proposed a change to the statement",
//         subject_type: "App\\Models\\Statement",
//         subject_id: 6093,
//         causer_type: "App\\Models\\User",
//         causer_id: 1336,
//         properties:
//           '{"url": "/statement/history/2971/2", "camp_num": 2, "topic_num": 2971, "topic_name": "test 0021", "description": "<p>camp 1 camp a</p>"}',
//         created_at: 1692613681,
//         updated_at: 1692613681,
//       },
//     },
//   ],
//   current_page: 1,
//   per_page: 15,
//   last_page: 1,
//   total_rows: 2,
//   from: 1,
//   to: 15,
// };
const mockThread = {
  items: [
    {
      id: 12080,
      activity_id: 15149,
      user_id: 1256,
      viewed: 0,
      created_at: 1693579113,
      updated_at: 1693579113,
      activity: {
        id: 15149,
        log_name: "threads",
        description: "Sajid-Dev created a post",
        subject_type: "App\\Models\\Reply",
        subject_id: 1816,
        causer_type: "App\\Models\\User",
        causer_id: 1394,
        properties:
          '{"url": "/forum/1766-New1/1-Agreement/threads/726", "camp_num": 1, "camp_name": null, "topic_num": 1766, "topic_name": null, "description": "<p>test responesew posty</p>", "thread_name": "test respones"}',
        created_at: 1693579113,
        updated_at: 1693579113,
      },
    },
    {
      id: 12081,
      activity_id: 15149,
      user_id: 1345,
      viewed: 0,
      created_at: 1693579113,
      updated_at: 1693579113,
      activity: {
        id: 15149,
        log_name: "threads",
        description: "Sajid-Dev created a post",
        subject_type: "App\\Models\\Reply",
        subject_id: 1816,
        causer_type: "App\\Models\\User",
        causer_id: 1394,
        properties:
          '{"url": "/forum/1766-New1/1-Agreement/threads/726", "camp_num": 1 , "topic_num": 1766, "topic_name": null, "description": "<p>test responesew posty</p>", "thread_name": "test respones"}',
        created_at: 1693579113,
        updated_at: 1693579113,
      },
    },
  ],
  current_page: 1,
  per_page: 15,
  last_page: 1,
  total_rows: 2,
  from: 1,
  to: 15,
};

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
  recentActivities: {
    topicsData: {
      topics: mocktopic.items,
      numOfPages: 1,
    },
    threadsData: {
      topics: mockThread.items,
      numOfPages: 1,
    },
    isCheckedAllRecent: false,
  },
});
const store2 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
  recentActivities: {
    topicsData: {
      topics: [],
      numOfPages: 0,
    },
    threadsData: {
      topics: [],
      numOfPages: 0,
    },
    isCheckedAllRecent: false,
  },
});
describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", async () => {
    await act(async () => {
      store.dispatch(setTopics(mocktopic));
      const data = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({ asPath: "/activities" })}
          >
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );
      const { container } = data;

      const listItems = container.querySelectorAll(".ant-list-item.listItem");

      expect(listItems.length).toBe(4);
      const mainHeadig = screen.getByRole("heading", {
        name: /recent activities/i,
      });
      const topictab = screen.getByRole("tab", {
        name: /topics\/camps/i,
      });
      const threadtab = screen.getByRole("tab", {
        name: /threads/i,
      });
      expect(container.getElementsByTagName("li")).toHaveLength(4);
      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(container.getElementsByTagName("a")).toHaveLength(4);

      expect(mainHeadig.textContent).toBe("Recent Activities");
      expect(topictab.textContent).toBe("Topics/Camps");
      expect(threadtab.textContent).toBe("Threads");

      expect(
        screen.getByRole("link", {
          name: /sajid-dev proposed a change to the camp topic: test updated 2 dec 2021 \| camp: agreement sep 4, 2023, 6:41:09 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the camp topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:31:04 pm/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /sajid-dev objected a change to statement camp 1 camp a aug 21, 2023, 3:28:31 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the statement topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:28:01 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /load more/i,
        })
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /load more/i,
        })
      );
    });
  });

  it("Should render without crash22", () => {
    act(() => {
      store.dispatch(setTopics(mocktopic));
      const { container } = render(
        <Provider store={store}>
          <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );

      const listItems = container.querySelectorAll(".ant-list-item.listItem");

      expect(listItems.length).toBe(4);

      const mainHeadig = screen.getByRole("heading", {
        name: /recent activities/i,
      });
      const topictab = screen.getByRole("tab", {
        name: /topics\/camps/i,
      });
      const threadtab = screen.getByRole("tab", {
        name: /threads/i,
      });

      expect(mainHeadig.textContent).toBe("Recent Activities");
      expect(topictab.textContent).toBe("Topics/Camps");
      expect(threadtab.textContent).toBe("Threads");

      expect(screen.getByText(/view all topics/i)).toBeInTheDocument();

      expect(container.getElementsByTagName("li")).toHaveLength(4);
      expect(container.getElementsByTagName("button")).toHaveLength(1);
      expect(container.getElementsByTagName("a")).toHaveLength(5);

      expect(
        screen.getByRole("link", {
          name: /sajid-dev proposed a change to the camp topic: test updated 2 dec 2021 \| camp: agreement sep 4, 2023, 6:41:09 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the camp topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:31:04 pm/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /sajid-dev objected a change to statement camp 1 camp a aug 21, 2023, 3:28:31 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the statement topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:28:01 pm/i,
        })
      ).toBeInTheDocument();
    });
  });

  it("Should render without  aa", async () => {
    await act(async () => {
      store.dispatch(setTopics(mocktopic));
      const { container } = render(
        <Provider store={store}>
          <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );

      fireEvent.click(
        screen.getByRole("tab", {
          name: /threads/i,
        })
      );
      await waitFor(() => {
        const loadingSkeletonElements = container.querySelectorAll(
          ".react-loading-skeleton"
        );
        expect(loadingSkeletonElements.length).toBeGreaterThan(0);
        const tabElement = screen.getByRole("tab", { name: /threads/i });
        const ariaSelectedValue = tabElement.getAttribute("aria-selected");
        expect(ariaSelectedValue).toBe("true");
      });

      fireEvent.click(
        screen.getByRole("tab", {
          name: /topics\/camps/i,
        })
      );
      await waitFor(() => {
        const loadingSkeletonElements = container.querySelectorAll(
          ".react-loading-skeleton"
        );
        expect(loadingSkeletonElements.length).toBeGreaterThan(0);
        const tabElement = screen.getByRole("tab", {
          name: /topics\/camps/i,
        });
        const ariaSelectedValue = tabElement.getAttribute("aria-selected");
        expect(ariaSelectedValue).toBe("true");
      });
    });
  });

  it("Should render without  admin", async () => {
    await act(async () => {
      // store1.dispatch(setTopics(mocktopic));
      render(
        <Provider store={store2}>
          <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
      expect(screen.getByText(/show all user activities/i)).toBeInTheDocument();
      const buttonElement = screen.getByRole("switch", {
        checked: false,
      });
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonElement);

      // await waitFor(() => {
      //   // expect(buttonElement).toHaveAttribute("aria-checked", "true");
      // });
    });
  });

  it("Should render without query params", async () => {
    await act(async () => {
      // store1.dispatch(setTopics(mocktopic));
      render(
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/activities",
              query: { tabName: "threads", topic_num: "44", camp_num: "1" },
            })}
          >
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );
      const tabElement = screen.getByRole("tab", { name: /threads/i });
      const ariaSelectedValue = tabElement.getAttribute("aria-selected");
      expect(ariaSelectedValue).toBe("true");
    });
  });

  it("Should render without crash without store", async () => {
    await act(async () => {
      store.dispatch(setTopics(mocktopic));
      const data = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/activities",
              query: { topic_num: "44", camp_num: "1" },
            })}
          >
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );
      const { container } = data;

      const listItems = container.querySelectorAll(".ant-list-item.listItem");

      expect(listItems.length).toBe(4);
      const mainHeadig = screen.getByRole("heading", {
        name: /recent activities/i,
      });
      const topictab = screen.getByRole("tab", {
        name: /topics\/camps/i,
      });
      const threadtab = screen.getByRole("tab", {
        name: /threads/i,
      });
      expect(container.getElementsByTagName("li")).toHaveLength(4);
      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(container.getElementsByTagName("a")).toHaveLength(4);

      expect(mainHeadig.textContent).toBe("Recent Activities");
      expect(topictab.textContent).toBe("Topics/Camps");
      expect(threadtab.textContent).toBe("Threads");

      expect(
        screen.getByRole("link", {
          name: /sajid-dev proposed a change to the camp topic: test updated 2 dec 2021 \| camp: agreement sep 4, 2023, 6:41:09 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the camp topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:31:04 pm/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /sajid-dev objected a change to statement camp 1 camp a aug 21, 2023, 3:28:31 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /evil-tester587 proposed a change to the statement topic: test 0021 \| camp: camp 1 aug 21, 2023, 3:28:01 pm/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /load more/i,
        })
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /load more/i,
        })
      );
    });
  });
});
