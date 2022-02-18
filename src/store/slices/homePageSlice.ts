import { createSlice } from "@reduxjs/toolkit";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    canonizedTopicsData: {
      topics: null,
      numOfPages: null,
    },
    filterObject: {
      page_number: 1,
      page_size: 15,
      namespace_id: 1,
      asofdate: Date.now() / 1000,
      asof: "default",
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "Hard",
      includeReview: false,
    },
    nameSpaces: null,
    whatsNew: null,
    algorithms: null,
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
    setFilterCanonizedTopics: (state, action) => {
      state.filterObject = {
        ...state.filterObject,
        ...action.payload,
        includeReview: false,
      };
    },
    setIsReviewCanonizedTopics: (state, action) => {
      state.filterObject = {
        ...state.filterObject,
        ...action.payload,
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
  },
});

export const {
  setCanonizedTopics,
  setFilterCanonizedTopics,
  setCanonizedNameSpaces,
  setWhatsNewContent,
  setIsReviewCanonizedTopics,
  pushToCanonizedTopics,
  setCanonizedAlgorithms,
} = homePageSlice.actions;

export default homePageSlice.reducer;
