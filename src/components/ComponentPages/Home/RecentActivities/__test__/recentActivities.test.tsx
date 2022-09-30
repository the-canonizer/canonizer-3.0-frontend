import RecentActivities from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import exp from "constants";
import { setTopics } from "../../../../../store/slices/recentActivitiesSlice";

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

// router.asPath !== "/activities"
afterEach(cleanup);
windowMatchMedia();

describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", () => {
    act(() => {
      store.dispatch(
        setTopics({
          items: [
            {
              id: 43,
              activity_id: 89,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:45.000000Z",
              updated_at: "2022-05-19T11:51:45.000000Z",
              activity: {
                id: 89,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 502,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:45.000000Z",
                updated_at: "2022-05-19T11:51:45.000000Z",
              },
            },
            {
              id: 42,
              activity_id: 88,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:41.000000Z",
              updated_at: "2022-05-19T11:51:41.000000Z",
              activity: {
                id: 88,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 495,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:41.000000Z",
                updated_at: "2022-05-19T11:51:41.000000Z",
              },
            },
            {
              id: 41,
              activity_id: 87,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:37.000000Z",
              updated_at: "2022-05-19T11:51:37.000000Z",
              activity: {
                id: 87,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 496,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:37.000000Z",
                updated_at: "2022-05-19T11:51:37.000000Z",
              },
            },
            {
              id: 40,
              activity_id: 86,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:18.000000Z",
              updated_at: "2022-05-19T11:51:18.000000Z",
              activity: {
                id: 86,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 506,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:18.000000Z",
                updated_at: "2022-05-19T11:51:18.000000Z",
              },
            },
            {
              id: 39,
              activity_id: 85,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:14.000000Z",
              updated_at: "2022-05-19T11:51:14.000000Z",
              activity: {
                id: 85,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 503,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:14.000000Z",
                updated_at: "2022-05-19T11:51:14.000000Z",
              },
            },
            {
              id: 38,
              activity_id: 84,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:09.000000Z",
              updated_at: "2022-05-19T11:51:09.000000Z",
              activity: {
                id: 84,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 504,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:09.000000Z",
                updated_at: "2022-05-19T11:51:09.000000Z",
              },
            },
            {
              id: 37,
              activity_id: 83,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:51:04.000000Z",
              updated_at: "2022-05-19T11:51:04.000000Z",
              activity: {
                id: 83,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 505,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:51:04.000000Z",
                updated_at: "2022-05-19T11:51:04.000000Z",
              },
            },
            {
              id: 36,
              activity_id: 82,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:50:54.000000Z",
              updated_at: "2022-05-19T11:50:54.000000Z",
              activity: {
                id: 82,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 493,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:50:54.000000Z",
                updated_at: "2022-05-19T11:50:54.000000Z",
              },
            },
            {
              id: 35,
              activity_id: 81,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:50:50.000000Z",
              updated_at: "2022-05-19T11:50:50.000000Z",
              activity: {
                id: 81,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 492,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:50:50.000000Z",
                updated_at: "2022-05-19T11:50:50.000000Z",
              },
            },
            {
              id: 34,
              activity_id: 80,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:50:45.000000Z",
              updated_at: "2022-05-19T11:50:45.000000Z",
              activity: {
                id: 80,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 488,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:50:45.000000Z",
                updated_at: "2022-05-19T11:50:45.000000Z",
              },
            },
            {
              id: 33,
              activity_id: 79,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:50:40.000000Z",
              updated_at: "2022-05-19T11:50:40.000000Z",
              activity: {
                id: 79,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 489,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:50:40.000000Z",
                updated_at: "2022-05-19T11:50:40.000000Z",
              },
            },
            {
              id: 32,
              activity_id: 78,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-19T11:50:32.000000Z",
              updated_at: "2022-05-19T11:50:32.000000Z",
              activity: {
                id: 78,
                log_name: "topic/camps",
                description: "News deleted by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 553,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/88/1", "camp_num": 1, "topic_num": 88}',
                created_at: "2022-05-19T11:50:32.000000Z",
                updated_at: "2022-05-19T11:50:32.000000Z",
              },
            },
            {
              id: 28,
              activity_id: 55,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-18T13:46:44.000000Z",
              updated_at: "2022-05-18T13:46:44.000000Z",
              activity: {
                id: 55,
                log_name: "topic/camps",
                description: "News added by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 556,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/89/1", "camp_num": 1, "topic_num": 89}',
                created_at: "2022-05-18T13:46:44.000000Z",
                updated_at: "2022-05-18T13:46:44.000000Z",
              },
            },
            {
              id: 27,
              activity_id: 54,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-18T13:46:15.000000Z",
              updated_at: "2022-05-18T13:46:15.000000Z",
              activity: {
                id: 54,
                log_name: "topic/camps",
                description: "News added by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 555,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/89/1", "camp_num": 1, "topic_num": 89}',
                created_at: "2022-05-18T13:46:15.000000Z",
                updated_at: "2022-05-18T13:46:15.000000Z",
              },
            },
            {
              id: 26,
              activity_id: 53,
              user_id: 1230,
              viewed: 0,
              created_at: "2022-05-18T13:45:56.000000Z",
              updated_at: "2022-05-18T13:45:56.000000Z",
              activity: {
                id: 53,
                log_name: "topic/camps",
                description: "News added by Shahab  Ramzan",
                subject_type: "App\\Models\\NewsFeed",
                subject_id: 554,
                causer_type: "App\\Models\\User",
                causer_id: 1230,
                properties:
                  '{"url": "/topic/89/1", "camp_num": 1, "topic_num": 89}',
                created_at: "2022-05-18T13:45:56.000000Z",
                updated_at: "2022-05-18T13:45:56.000000Z",
              },
            },
          ],
          current_page: 1,
          per_page: 15,
          last_page: 3,
          total_rows: 40,
          from: 1,
          to: 15,
        })
      );
      const { container } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({ asPath: "/activities" })}
          >
            <RecentActivities />
          </RouterContext.Provider>
        </Provider>
      );
      const mainHeadig = screen.getByRole("heading", {
        name: /recent activities/i,
      });
      const topictab = screen.getByRole("tab", {
        name: /topics\/camps/i,
      });
      const threadtab = screen.getByRole("tab", {
        name: /threads/i,
      });
      const loadmorebutton = screen.getByRole("button", {
        name: /load more topics/i,
      });
      expect(container.getElementsByTagName("li")).toHaveLength(15);
      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(mainHeadig.textContent).toBe("Recent Activities");
      expect(topictab.textContent).toBe("Topics/Camps");
      expect(threadtab.textContent).toBe("Threads");
      expect(loadmorebutton.textContent).toBe("Load More topics");

      // when asPath "/" then use this

      // const mainHeadig = screen.getByRole("heading", {
      //   name: /recent activities/i,
      // });
      // const topictab = screen.getByRole("tab", {
      //   name: /topics\/camps/i,
      // });
      // const threadtab = screen.getByRole("tab", {
      //   name: /threads/i,
      // });

      // expect(container.getElementsByTagName("li")).toHaveLength(15);
      // expect(container.getElementsByTagName("button")).toHaveLength(1);

      // expect(mainHeadig.textContent).toBe("Recent Activities");

      // expect(topictab.textContent).toBe("Topics/Camps");

      // expect(threadtab.textContent).toBe("Threads");
      // expect(screen.getByText(/view all topics/i)).toBeInTheDocument();
    });
  });
});
