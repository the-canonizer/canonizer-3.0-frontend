import { createSlice } from "@reduxjs/toolkit";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    canonizedTopicsData: {
      topics: null,
      numOfPages: null,
    },

    nameSpaces: null,
    whatsNew: null,
    algorithms: null,
    trandingAlgo: "blind_popularity",
  },
  reducers: {
    setCanonizedTopics: (state, action) => {
      state.canonizedTopicsData = {
        topics: action.payload?.topic,
        numOfPages: action.payload?.number_of_pages,
      };
    },
    pushToCanonizedTopics: (state, action) => {
      state.canonizedTopicsData = {
        ...state.canonizedTopicsData,
        topics: [...state.canonizedTopicsData.topics, ...action.payload.topic],
      };
    },

    setCanonizedNameSpaces: (state, action) => {
      state.nameSpaces = action.payload?.data;
    },
    setCanonizedAlgorithms: (state, action) => {
      state.algorithms = action.payload?.data;
    },
    setWhatsNewContent: (state, action) => {
      state.whatsNew = action.payload[0]?.html_content;
    },
    setTrandingAlgo: (state, action) => {
      state.trandingAlgo = action.payload;
    },
  },
});

export const {
  setCanonizedTopics,
  setCanonizedNameSpaces,
  setWhatsNewContent,
  pushToCanonizedTopics,
  setCanonizedAlgorithms,
  setTrandingAlgo,
} = homePageSlice.actions;

export default homePageSlice.reducer;
