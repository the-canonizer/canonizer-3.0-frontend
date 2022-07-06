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
    campStatementHistory: {
      items: [],
      details: {
        ifIamSupporter: null,
      },
    },
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
    setCurrentTopicRecordSubscriptionId: (state, action) => {
      state.currentTopicRecord = {
        ...state.currentTopicRecord,
        topicSubscriptionId: action.payload,
      };
    },
    setCurrentCampRecord: (state, action) => {
      state.currentCampRecord = action.payload;
    },
    setCurrentCampRecordSubscriptionId: (state, action) => {
      state.currentCampRecord = {
        ...state.currentCampRecord,
        subscriptionId: action.payload,
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
    pushToCampStatementHistory: (state, action) => {
      state.campStatementHistory = {
        ...state.campStatementHistory,
        items: [...state.campStatementHistory.items, ...action.payload],
      };
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
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
  pushToCampStatementHistory,
} = treeSlice.actions;

export default treeSlice.reducer;
