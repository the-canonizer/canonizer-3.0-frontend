import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    canonizedTopics: null,
  },
  reducers: {
    setCanonizedTopics: (state, action) => {
      debugger;
      state.canonizedTopics = action.payload;
    },
  },
});

export const { setCanonizedTopics } = homePageSlice.actions;

export default homePageSlice.reducer;
