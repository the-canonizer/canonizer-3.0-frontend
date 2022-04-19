import { createSlice } from "@reduxjs/toolkit";

export const campNewsSlice = createSlice({
  name: "news",
  initialState: {
    campNews: {
      newsToEdit: null,
    },
  },
  reducers: {
    setCampNewsToEdit: (state, action) => {
      state.campNews = {
        ...state.campNews,
        newsToEdit: action.payload,
      };
    },
  },
});

export const { setCampNewsToEdit } = campNewsSlice.actions;

export default campNewsSlice.reducer;
