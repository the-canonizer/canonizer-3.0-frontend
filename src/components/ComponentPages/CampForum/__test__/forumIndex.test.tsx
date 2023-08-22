import { render, screen, act, waitFor, cleanup } from "src/utils/testUtils";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import ForumComponent from "../index";

const useRouter = jest.fn();

export { useRouter };

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/",
      pathname: "/forum/[topic]/[camp]/threads",
      query: { camp: "1-Agreement", topic: "88-theories" },
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

const useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>;

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

// Create a mock store
const mockStore = configureMockStore();
const store = mockStore({
  topicDetails: {
    currentCampRecord: {},
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});

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

describe("ForumComponent", () => {
  beforeEach(() => {
    useRouterMock.mockReset();
    jest.clearAllMocks();
  });

  test("renders ForumComponent", () => {
    jest.mock("next/router", () => ({
      __esModule: true,
      useRouter() {
        return {
          route: "/",
          pathname: "/forum/[topic]/[camp]/threads",
          query: { camp: "1-Agreement", topic: "88-theories" },
          asPath: "",
          push: jest.fn(),
          events: {
            on: jest.fn(),
            off: jest.fn(),
          },
          beforePopState: jest.fn(() => null),
          prefetch: jest.fn(() => null),
        };
      },
    }));

    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            query: { camp: "1-Agreement", topic: "88-theories" },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("Camp Forum")).toBeInTheDocument();
    expect(screen.getByText("List of All Camp Threads")).toBeInTheDocument();
  });

  test("fetches and displays thread list", async () => {
    const mockGetThreadsList = jest.fn().mockResolvedValueOnce({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    jest.mock("src/network/api/campForumApi", () => ({
      getThreadsList: mockGetThreadsList,
    }));

    const mockGetThreadData = jest.fn().mockResolvedValueOnce({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    jest.mock("src/network/api/campForumApi", () => ({
      getThreadData: mockGetThreadData,
    }));

    const mockFetchNickNameList = jest.fn().mockResolvedValueOnce({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    jest.mock("src/network/api/campForumApi", () => ({
      fetchNickNameList: mockFetchNickNameList,
    }));

    render(
      <Provider store={store}>
        <ForumComponent />
      </Provider>
    );

    screen.getByText("Thread Name");
  });

  test("fetches and displays thread list black", async () => {
    const mockGetThreadsList = jest.fn().mockResolvedValueOnce({
      status_code: 400,
      data: null,
    });

    jest.mock("src/network/api/campForumApi", () => ({
      getThreadsList: mockGetThreadsList,
    }));

    const mockGetThreadData = jest.fn().mockResolvedValueOnce({
      status_code: 400,
      data: null,
    });

    jest.mock("src/network/api/campForumApi", () => ({
      getThreadData: mockGetThreadData,
    }));

    const mockFetchNickNameList = jest.fn().mockResolvedValueOnce({
      status_code: 400,
      data: null,
    });

    jest.mock("src/network/api/campForumApi", () => ({
      fetchNickNameList: mockFetchNickNameList,
    }));

    render(
      <Provider store={store}>
        <ForumComponent />
      </Provider>
    );

    screen.getByText("Thread Name");
  });

  test("displays error message when thread creation fails", async () => {
    act(() => {
      const mockCreateThread = jest.fn().mockResolvedValueOnce({
        status_code: 500,
        message: "Thread creation failed",
      });

      jest.mock("src/network/api/campForumApi", () => ({
        createThread: mockCreateThread,
      }));

      jest.mock("next/router", () => ({
        __esModule: true,
        useRouter() {
          return {
            route: "/",
            pathname: "/forum/[topic]/[camp]/threads/create",
            query: { camp: "1-Agreement", topic: "88-theories" },
            asPath: "",
            push: jest.fn(),
            events: {
              on: jest.fn(),
              off: jest.fn(),
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null),
          };
        },
      }));
    });

    render(
      <Provider store={store}>
        <ForumComponent />
      </Provider>
    );

    waitFor(() => {
      userEvent.click(screen.getByText("Create Thread"));

      userEvent.type(screen.getByLabelText("Thread Title"), "New Thread");
    });
  });
});
