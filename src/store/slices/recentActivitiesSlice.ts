import { createSlice } from "@reduxjs/toolkit";

export const recentActivitiesSlice = createSlice({
  name: "rececntActivities",
  initialState: {
    topicsData: {
      topics: [],

      numOfPages: 0,
    },
    threadsData: {
      topics: [],

      numOfPages: 0,
    },
  },
  reducers: {
    setTopics: (state, action) => {
      state.topicsData = {
        topics: action.payload?.items,
        numOfPages: action.payload?.last_page,
      };
    },
    pushToTopics: (state, action) => {
      state.topicsData = {
        ...state.topicsData,
        topics: [...state.topicsData.topics, ...action.payload?.items],
      };
    },
    setThreads: (state, action) => {
      state.threadsData = {
        topics: action.payload?.items,
        numOfPages: action.payload?.last_page,
      };
    },
    pushToThreads: (state, action) => {
      state.threadsData = {
        ...state.threadsData,
        topics: [...state.threadsData.topics, ...action.payload?.items],
      };
    },
  },
});

export const { setTopics, pushToTopics, setThreads, pushToThreads } =
  recentActivitiesSlice.actions;

export default recentActivitiesSlice.reducer;
