import { createSlice } from "@reduxjs/toolkit";

export const hotTopicSlice = createSlice({
  name: "hotTopic",
  initialState: {
    topicData: null,
  },
  reducers: {
    setHotTopic: (state, action) => {
      state.topicData = action.payload;
    },
  },
});

export const { setHotTopic } = hotTopicSlice.actions;

export default hotTopicSlice.reducer;
