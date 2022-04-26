import { createSlice } from "@reduxjs/toolkit";

export const forumSlice = createSlice({
  name: "forum",
  initialState: {
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
  },
});

export const { setThread, setPost } = forumSlice.actions;

export default forumSlice.reducer;
