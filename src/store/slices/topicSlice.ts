import { createSlice } from "@reduxjs/toolkit";

export const topicSlice = createSlice({
  name: "topic",
  initialState: {
    currentTopic: {
      topic_num: null,
      topic_name: "",
      camp_name: "",
      parent_camp_num: "",
      message: null,
    },
  },
  reducers: {
    setCurrentTopic: (state, action) => {
      state.currentTopic = { ...state.currentTopic, ...action.payload };
    },
    resetCurrentTopic: (state) => {
      state.currentTopic = {
        topic_num: null,
        topic_name: "",
        camp_name: "",
        parent_camp_num: "",
        message: null,
      };
    },
  },
});

export const { setCurrentTopic, resetCurrentTopic } = topicSlice.actions;

export default topicSlice.reducer;
