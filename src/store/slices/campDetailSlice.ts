import { createSlice } from "@reduxjs/toolkit";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
    newsFeed: null,
    campStatement: null,
    campSupportingTree: null,
    currentTopicRecord: null,
    currentCampRecord: null,
    campStatementHistory: null,
  },
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload;
    },
    setNewsFeed: (state, action) => {
      state.newsFeed = action.payload;
    },
    setCampStatement: (state, action) => {
      state.campStatement = action.payload;
    },
    setCurrentTopicRecord: (state, action) => {
      state.currentTopicRecord = action.payload;
    },
    setCurrentTopicSubscriptionID: (state, action) => {
      state.currentTopicRecord = {
        ...state.currentCampRecord,
        topicSubscriptionId: action.payload,
      };
    },
    setCurrentCampRecord: (state, action) => {
      state.currentCampRecord = action.payload;
    },
    setCurrentCampSubscriptionID: (state, action) => {
      state.currentCampRecord = {
        ...state.currentCampRecord,
        campSubscriptionId: action.payload,
      };
    },
    setCampSupportingTree: (state, action) => {
      state.campSupportingTree = action.payload;
    },
    pushToCampSupportingTree: (state, action) => {
      state.campSupportingTree = [
        ...state.campSupportingTree,
        ...action.payload,
      ];
    },
    setCampStatementHistory: (state, action) => {
      state.campStatementHistory = action.payload;
    },
  },
});

export const {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setCampStatementHistory,
  setCurrentCampSubscriptionID,
  setCurrentTopicSubscriptionID,
} = treeSlice.actions;

export default treeSlice.reducer;
