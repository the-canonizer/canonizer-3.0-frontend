import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
    searchLoading: false,
  },
  reducers: {
    setLoadingAction: (state, action) => {
      state.loading = action.payload;
    },
    setSearchLoadingAction: (state, action) => {
      state.searchLoading = action.payload;
    },
  },
});

export const { setLoadingAction, setSearchLoadingAction } =
  loadingSlice.actions;

export default loadingSlice.reducer;
