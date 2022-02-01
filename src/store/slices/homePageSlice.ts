import { createSlice } from "@reduxjs/toolkit";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    canonizedTopicsData: null,
    filterObject: {
      page_number: 1,
      page_size: 15,
      namespace_id: 1,
      asofdate: 1642464000,
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "Hard",
    },
    nameSpaces: null,
    whatsNew: null,
  },
  reducers: {
    setCanonizedTopics: (state, action) => {
      state.canonizedTopicsData = action.payload;
    },
    setFilterCanonizedTopics: (state, action) => {
      state.filterObject = {
        ...state.filterObject,
        ...action.payload,
      };
    },
    setCanonizedNameSpaces: (state, action) => {
      state.nameSpaces = action.payload?.data;
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
} = homePageSlice.actions;

export default homePageSlice.reducer;
