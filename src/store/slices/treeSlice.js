import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import NetworkCall from "../../network/networkCall";
import UserRequest from "../../network/request/userRequest";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
  },
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload.tree;
    },
  },
});

export const { setTree } = treeSlice.actions;

export default treeSlice.reducer;
