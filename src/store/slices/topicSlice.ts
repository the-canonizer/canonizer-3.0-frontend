import { createSlice } from "@reduxjs/toolkit";

export const topicSlice = createSlice({
  name: "topic",
  initialState: {
    currentTopic: {
      topic_num: null,
      topic_name: "",
      camp_name: "Agreement",
      parent_camp_num: "1",
      message: null,
    },
  },
  reducers: {
    setCurrentTopic: (state, action) => {
      console.log("state", state.currentTopic);
      state.currentTopic = {
        topic_num: action.payload.topic_num,
        topic_name: "",
        camp_name: "Agreement",
        parent_camp_num: "1",
        message: action.payload.message,
      };
    },
    resetCurrentTopic: (state) => {
      state.currentTopic = {
        topic_num: null,
        topic_name: "",
        camp_name: "Agreement",
        parent_camp_num: "1",
        message: null,
      };
    },
  },
});

export const { setCurrentTopic, resetCurrentTopic } = topicSlice.actions;

export default topicSlice.reducer;
