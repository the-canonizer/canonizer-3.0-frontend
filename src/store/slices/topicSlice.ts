import { createSlice } from "@reduxjs/toolkit";

export const topicSlice = createSlice({
  name: "topic",
  initialState: {
    createdTopic: null,
  },
  reducers: {
    setCreatedTopic: (state, action) => {
      state.createdTopic = action.payload;
    },
  },
});

export const { setCreatedTopic } = topicSlice.actions;

export default topicSlice.reducer;
