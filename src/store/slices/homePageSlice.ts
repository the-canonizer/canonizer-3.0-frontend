import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    canonizedTopics: null,
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
  },
  reducers: {
    setCanonizedTopics: (state, action) => {
      state.canonizedTopics = action.payload?.data;
      state.canonizedTopicsData = action.payload;
    },
    setFilterCanonizedTopics: (state, action) => {
      state.filterObject = {
        ...state.filterObject,
        ...action.payload,
      };
    },
  },
});

export const { setCanonizedTopics, setFilterCanonizedTopics } =
  homePageSlice.actions;

export default homePageSlice.reducer;
