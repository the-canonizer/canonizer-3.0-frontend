import recentActivitiesReducer, {
  setTopics,
  pushToTopics,
  setThreads,
  pushToThreads,
  setIsChecked,
} from "../recentActivitiesSlice"; // Replace with the path to your slice file

describe("recentActivitiesSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      topicsData: {
        topics: [],
        numOfPages: 0,
      },
      threadsData: {
        topics: [],
        numOfPages: 0,
      },
      isCheckedAllRecent: false,
    };
  });

  it("should handle setTopics", () => {
    const topicsPayload = {
      items: [{ id: 1, title: "Topic 1" }],
      last_page: 1,
    };
    const newState = recentActivitiesReducer(initialState, setTopics(topicsPayload));
    expect(newState.topicsData.topics).toEqual(topicsPayload.items);
    expect(newState.topicsData.numOfPages).toEqual(topicsPayload.last_page);
  });

  it("should handle pushToTopics", () => {
    const existingTopics = [{ id: 1, title: "Topic 1" }];
    const newTopics = [{ id: 2, title: "Topic 2" }, { id: 3, title: "Topic 3" }];
    const topicsPayload = {
      items: newTopics,
    };
    const initialStateWithTopics = {
      ...initialState,
      topicsData: {
        topics: existingTopics,
        numOfPages: 1,
      },
    };
    const newState = recentActivitiesReducer(initialStateWithTopics, pushToTopics(topicsPayload));
    expect(newState.topicsData.topics).toEqual([...existingTopics, ...newTopics]);
  });

  it("should handle setThreads", () => {
    const threadsPayload = {
      items: [{ id: 1, title: "Thread 1" }],
      last_page: 1,
    };
    const newState = recentActivitiesReducer(initialState, setThreads(threadsPayload));
    expect(newState.threadsData.topics).toEqual(threadsPayload.items);
    expect(newState.threadsData.numOfPages).toEqual(threadsPayload.last_page);
  });

  it("should handle pushToThreads", () => {
    const existingThreads = [{ id: 1, title: "Thread 1" }];
    const newThreads = [{ id: 2, title: "Thread 2" }, { id: 3, title: "Thread 3" }];
    const threadsPayload = {
      items: newThreads,
    };
    const initialStateWithThreads = {
      ...initialState,
      threadsData: {
        topics: existingThreads,
        numOfPages: 1,
      },
    };
    const newState = recentActivitiesReducer(initialStateWithThreads, pushToThreads(threadsPayload));
    expect(newState.threadsData.topics).toEqual([...existingThreads, ...newThreads]);
  });

  it("should handle setIsChecked", () => {
    const isChecked = true;
    const newState = recentActivitiesReducer(initialState, setIsChecked(isChecked));
    expect(newState.isCheckedAllRecent).toEqual(isChecked);
  });
});
