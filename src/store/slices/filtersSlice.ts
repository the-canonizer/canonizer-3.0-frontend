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
      is_archive: 0,
    },
    selectedCampNode: null,
    current_date: new Date().valueOf(),
    viewThisVersionCheck: false,
    showDrawer: false,
    showForumDrawer: false,
    campWithScoreValue: 10,
    onlyMyTopicsCheck: false,
    selectAlgoBrowsePage: false,
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
    setCurrentCamp: (state, action) => {
      state.selectedCampNode = action.payload;
    },
    setViewThisVersion: (state, action) => {
      state.viewThisVersionCheck = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.current_date = action.payload;
    },
    setShowDrawer: (state, action) => {
      state.showDrawer = action.payload;
    },
    setCampWithScorevalue: (state, action) => {
      state.campWithScoreValue = action.payload;
    },
    setShowForumDrawer: (state, action) => {
      state.showForumDrawer = action.payload;
    },
    setOnlyMyTopic: (state, action) => {
      state.onlyMyTopicsCheck = action.payload;
    },
    setRemoveFilters: (state, action) => {
      state.filterObject = action.payload;
    },
    setSelectAlgoBrowsePage: (state, action) => {
      state.selectAlgoBrowsePage = action.payload;
    },
  },
});

export const {
  setFilterCanonizedTopics,
  setIsReviewCanonizedTopics,
  setCurrentCamp,
  setViewThisVersion,
  setCurrentDate,
  setShowDrawer,
  setCampWithScorevalue,
  setShowForumDrawer,
  setOnlyMyTopic,
  setRemoveFilters,
  setSelectAlgoBrowsePage,
} = filtersSlice.actions;

export default filtersSlice.reducer;
