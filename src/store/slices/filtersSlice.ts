import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: Date.now() / 1000,
      asof: "default",
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
    },
  },
  reducers: {
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
  },
});

export const {
  setFilterCanonizedTopics,

  setIsReviewCanonizedTopics,
} = filtersSlice.actions;

export default filtersSlice.reducer;
