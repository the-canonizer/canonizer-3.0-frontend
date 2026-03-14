import { createSlice } from "@reduxjs/toolkit";

export const forumSlice = createSlice({
  name: "forum",
  initialState: {
    isThreadDrawerOpen: false,
    isPostDrawerOpen: false,
    currentThread: {},
    currentPost: {},
  },
  reducers: {
    setThread: (state, action) => {
      state.currentThread = action.payload;
    },
    setPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setIsThreadDrawerOpen: (state, action) => {
      state.isThreadDrawerOpen = action.payload;
    },
    setIsPostDrawerOpen: (state, action) => {
      state.isPostDrawerOpen = action.payload;
    },
  },
});

export const {
  setThread,
  setPost,
  setIsThreadDrawerOpen,
  setIsPostDrawerOpen,
} = forumSlice.actions;

export default forumSlice.reducer;
