import { createSlice } from "@reduxjs/toolkit";

export const hotTopicSlice = createSlice({
  name: "hotTopic",
  initialState: {
    topicData: [],
    featuredTopic: [],
    preferedTopic: [],
    openConsensusTreePopup: false,
    consensusVideoPodcasts:[],
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
    setOpenConsensusTreePopup: (state, action) => {
      state.openConsensusTreePopup = action.payload;
    },
    setConsensusVideoPodcasts:(state,action)=>{
      state.consensusVideoPodcasts = action.payload
    }
  },
});

export const {
  setHotTopic,
  setPrefTopic,
  setFeaturedTopic,
  setOpenConsensusTreePopup,
  setConsensusVideoPodcasts
} = hotTopicSlice.actions;

export default hotTopicSlice.reducer;
