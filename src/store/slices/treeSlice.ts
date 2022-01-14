import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
  },
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload.data;
    },
  },
});

export const { setTree } = treeSlice.actions;

export default treeSlice.reducer;
