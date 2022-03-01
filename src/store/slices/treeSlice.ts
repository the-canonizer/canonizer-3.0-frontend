import { createSlice } from "@reduxjs/toolkit";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
  },
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload;
    },
  },
});

export const { setTree } = treeSlice.actions;

export default treeSlice.reducer;
