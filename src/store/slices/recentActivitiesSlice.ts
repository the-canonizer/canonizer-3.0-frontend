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
    isCheckedAllRecent: false,
    campActivityData: [],
  },
  reducers: {
    setCampActivityData: (state, action) => {
      state.campActivityData = action.payload;
    },
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
    setIsChecked: (state, action) => {
      state.isCheckedAllRecent = action.payload;
    },
  },
});

export const {
  setTopics,
  pushToTopics,
  setThreads,
  pushToThreads,
  setIsChecked,
  setCampActivityData,
} = recentActivitiesSlice.actions;

export default recentActivitiesSlice.reducer;