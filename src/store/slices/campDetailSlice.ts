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
    setCurrentCampRecord: (state, action) => {
      state.currentCampRecord = action.payload;
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
} = treeSlice.actions;

export default treeSlice.reducer;
