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
      submitter_nick_id: null,
    },
  },
  reducers: {
    setCurrentTopic: (state, action) => {
      console.log("state", state.currentTopic);
      state.currentTopic = {
        topic_num: action.payload.topic_num,
        topic_name: action.payload.topic_name || "",
        camp_name: action.payload.camp_name || "Agreement",
        parent_camp_num: action.payload.parent_camp_num || "1",
        message: action.payload.message,
        submitter_nick_id: action.payload.submitter_nick_id,
      };
    },
    resetCurrentTopic: (state) => {
      state.currentTopic = {
        topic_num: null,
        topic_name: "",
        camp_name: "Agreement",
        parent_camp_num: "1",
        message: null,
        submitter_nick_id: null,
      };
    },
  },
});

export const { setCurrentTopic, resetCurrentTopic } = topicSlice.actions;

export default topicSlice.reducer;
