import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import ForumComponent from "../index";

import {
  getThreadsList,
  getPostsList,
  getThreadData,
} from "src/network/api/campForumApi";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

// Create a mock store
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
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: Date.now() / 1000,
      asof: "default",
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
  },
  forum: {
    currentThread: {},
    currentPost: {},
  },
});

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/forum/[topic]/[camp]/threads",
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

jest.mock("src/network/api/campForumApi");
jest.mock("src/network/api/campDetailApi");

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

afterEach(cleanup);

describe("ForumComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Forum Component", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: { camp: "1-Agreement", by: "all", topic: "88-theories" },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("Camp Forum")).toBeInTheDocument();
    expect(screen.getByText("All Threads")).toBeInTheDocument();
    expect(screen.getByText("My Threads")).toBeInTheDocument();
    expect(screen.getByText("My Participation")).toBeInTheDocument();
    expect(screen.getByText("Top 10")).toBeInTheDocument();
    expect(screen.getByText("Create Thread")).toBeInTheDocument();
    expect(screen.getByText("List of All Camp Threads")).toBeInTheDocument();
  });

  test("fetches and displays thread list", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    const createBtn = screen.getByTestId("create-new-thread");
    expect(createBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(getThreadsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });
  });

  test("click on fetched thread list item", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    const createBtn = screen.getByTestId("create-new-thread");
    expect(createBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(getThreadsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });

    const thread1 = screen.getByTestId("thread-label-2");
    expect(thread1).toBeInTheDocument();
    fireEvent.click(thread1);
  });

  test("check with not logged in click on fetched thread list item", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: {
              camp: "1-Agreement",
              by: "most_recents",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    const createBtn = screen.getByTestId("create-new-thread");
    expect(createBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(getThreadsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });

    const thread1 = screen.getByTestId("thread-label-2");
    expect(thread1).toBeInTheDocument();
    fireEvent.click(thread1);
  });

  test("without login fetches and displays thread list", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    const store1 = mockStore({
      auth: {
        authenticated: false,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: {
              camp: "1-Agreement",
              by: "most_replies",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    const createBtn = screen.getByTestId("create-new-thread");
    expect(createBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(getThreadsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });
  });

  test("click on create new thread button", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        { id: 1, title: "Thread 1" },
        { id: 2, title: "Thread 2" },
      ],
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads/create",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("Create a new thread")).toBeInTheDocument();
    expect(screen.getByText("Title of Thread")).toBeInTheDocument();
    expect(
      screen.getByText(
        "(Once you pick a nickname, for any contribution to a topic, you must always use the same nickname for any other contribution or forum post to this topic.)"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });
  });

  test("click on create new thread button without login", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    const store1 = mockStore({
      auth: {
        authenticated: false,
        loggedInUser: null,
      },
      topicDetails: {
        currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
      },
      filters: {
        filterObject: {
          page_number: 1,
          page_size: 15,
          nameSpace: "/General/",
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getThreadData).toHaveBeenCalled();
    });

    const createBTN = screen.getByTestId("create-new-thread");
    expect(createBTN).toBeInTheDocument();
    fireEvent.click(createBTN);
  });

  test("click on cancel craete thread button", async () => {
    act(() => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        { id: 1, title: "Thread 1" },
        { id: 2, title: "Thread 2" },
      ],
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads/create",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("Create a new thread")).toBeInTheDocument();
    expect(screen.getByText("Title of Thread")).toBeInTheDocument();
    expect(
      screen.getByText(
        "(Once you pick a nickname, for any contribution to a topic, you must always use the same nickname for any other contribution or forum post to this topic.)"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId("back-btn"));
  });

  test("render posts components", async () => {
    jest.spyOn(React, "useRef").mockReturnValue({
      current: true,
    });

    jest.useFakeTimers();
    jest.runAllTimers();

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getPostsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        { id: 1, title: "Thread 1" },
        { id: 2, title: "Thread 2" },
      ],
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
          id: 1,
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
          namespace_id: 1,
          asofdate: Date.now() / 1000,
          asof: "default",
          filterByScore: 0,
          algorithm: "blind_popularity",
          search: "",
          includeReview: false,
          is_archive: 0,
        },
      },
      forum: {
        currentThread: {},
        currentPost: {},
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads/[id]",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    waitFor(() => {
      expect(getPostsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
      expect(getAllUsedNickNames).toHaveBeenCalled();
      // expect(
      //   screen.getByText("Number of Post in this thread: 2")
      // ).toBeInTheDocument();
    });
  });

  test("posts components case", async () => {
    jest.spyOn(React, "useRef").mockReturnValue({
      current: true,
    });

    getThreadData.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "Thread 1" },
          { id: 2, title: "Thread 2" },
        ],
        total_rows: 2,
      },
    });

    getPostsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          {
            id: 1,
            title: "Thread 1",
            is_my_post: true,
            created_at: Date.now(),
            updated_at: Date.now(),
            nick_name: "Test",
            body: "this is test body",
          },
          {
            id: 2,
            title: "Thread 2",
            is_my_post: false,
            created_at: Date.now(),
            updated_at: Date.now(),
            nick_name: "Test",
            body: "this is test body",
          },
        ],
        total_rows: 2,
      },
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        { id: 1, title: "Thread 1" },
        { id: 2, title: "Thread 2" },
      ],
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/forum/[topic]/[camp]/threads/[id]",
            query: {
              camp: "1-Agreement",
              by: "all",
              topic: "88-theories",
              id: "1",
            },
          })}
        >
          <ForumComponent />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getPostsList).toHaveBeenCalled();
      expect(getThreadData).toHaveBeenCalled();
      expect(getAllUsedNickNames).toHaveBeenCalled();
    });

    expect(
      screen.getByText("Number of Post in this thread: 2")
    ).toBeInTheDocument();
    expect(screen.getAllByText("this is test body").length).toEqual(2);
    const editBTN = screen.getByTestId("post-edit-icon1");
    const deleteBTN = screen.getByTestId("post-delete-icon-1");
    const deleteBTN2 = screen.getByTestId("post-delete-icon-1");

    expect(editBTN).toBeInTheDocument();
    expect(deleteBTN).toBeInTheDocument();
    expect(deleteBTN2).toBeInTheDocument();

    fireEvent.click(editBTN);

    screen.debug();
  });
});
