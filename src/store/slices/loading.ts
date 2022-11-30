import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoadingAction: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoadingAction } = loadingSlice.actions;

export default loadingSlice.reducer;
