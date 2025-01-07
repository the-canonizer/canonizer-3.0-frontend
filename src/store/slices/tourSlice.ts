
import { createSlice } from "@reduxjs/toolkit";

export const tourSlice = createSlice({
  name: "tour",
  initialState: {
    allSteps: [],
  },
  reducers: {
    setSteps: (state, action) => {
      state.allSteps = action.payload;
    },
  },
});

export const { setSteps } = tourSlice.actions;


export default tourSlice.reducer;

