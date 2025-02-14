import { createSlice } from "@reduxjs/toolkit";

export const algorithmSlice = createSlice({
  name: "algorithms",
  initialState: {
    algorithms: null,
  },
  reducers: {
    setAlgorithms: (state, action) => {
      state.algorithms = action.payload;
    },
  },
});

export const { setAlgorithms } = algorithmSlice.actions;

export default algorithmSlice.reducer;
