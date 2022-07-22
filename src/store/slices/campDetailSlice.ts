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
    history: {
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
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    pushToCampHistory: (state, action) => {
      state.history = {
        ...state.history,
        items: [...state.history.items, ...action.payload],
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
  setHistory,
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
  pushToCampHistory,
} = treeSlice.actions;

export default treeSlice.reducer;
