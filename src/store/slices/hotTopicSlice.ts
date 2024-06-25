import { createSlice } from "@reduxjs/toolkit";

export const hotTopicSlice = createSlice({
  name: "hotTopic",
  initialState: {
    topicData: {
      items: [],
    },
    featuredTopic: [],
    preferedTopic: [],
  },
  reducers: {
    setHotTopic: (state, action) => {
      state.topicData = action.payload;
    },
    setPrefTopic: (state, action) => {
      state.preferedTopic = action.payload;
    },
    setFeaturedTopic: (state, action) => {
      state.featuredTopic = action.payload;
    },
  },
});

export const { setHotTopic, setPrefTopic, setFeaturedTopic } =
  hotTopicSlice.actions;

export default hotTopicSlice.reducer;
