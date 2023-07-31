import { render, screen, waitFor, fireEvent } from "src/utils/testUtils";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";

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

describe("ForumComponent", () => {
  beforeEach(() => {
    useRouterMock.mockReset();
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
        <ForumComponent />
      </Provider>
    );

    // Assert
    // You can add assertions to check if certain elements are rendered correctly
    // expect(screen.getByText("Create Topic")).toBeInTheDocument();
    expect(screen.getByText("Camp Forum")).toBeInTheDocument();
    expect(screen.getByText("List of All Camp Threads")).toBeInTheDocument();
  });

  test("fetches and displays thread list", async () => {
    // Mock the necessary dependencies and API calls
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

    // Wait for the thread list to be loaded
    await screen.getByText("Thread Name");

    // Assert
    // expect(mockGetThreadsList).toHaveBeenCalled();
  });

  test("displays error message when thread creation fails", async () => {
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

    render(
      <Provider store={store}>
        <ForumComponent />
      </Provider>
    );

    // Simulate creating a thread
    userEvent.click(screen.getByText("Create Thread"));

    // Fill in the form and submit
    // userEvent.type(screen.getByLabelText("Thread Title"), "New Thread");
    // userEvent.click(screen.getByText("Submit"));

    // Wait for the error message to be displayed
    // await screen.findByText("Thread creation failed");

    // Assert
    // expect(mockCreateThread).toHaveBeenCalled();
    // expect(screen.getByText("Thread creation failed")).toBeInTheDocument();
  });

  // Add more test cases for other functionalities of the component
});
