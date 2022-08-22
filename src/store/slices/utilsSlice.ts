import { createSlice } from "@reduxjs/toolkit";

export const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    isLink: false,
  },
  reducers: {
    setIsLink: (state, action) => {
      state.isLink = action.payload.isLink;
    },
  },
});

export const { setIsLink } = utilsSlice.actions;

export default utilsSlice.reducer;
