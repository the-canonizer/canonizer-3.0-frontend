import { createSlice } from "@reduxjs/toolkit";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
    newsFeed: null,
    campStatement: null,
    campSupportingTree: null,
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
    setCampSupportingTree: (state, action) => {
      state.campSupportingTree = action.payload;
    },
  },
});

export const { setTree, setNewsFeed, setCampStatement, setCampSupportingTree } =
  treeSlice.actions;

export default treeSlice.reducer;
