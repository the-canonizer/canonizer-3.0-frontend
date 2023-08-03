import { createSlice } from "@reduxjs/toolkit";

export const treeCard = createSlice({
  name: "supportTreeCard",
  initialState: {
    currentDelegatedSupportedClick: { delegatedSupportClick: false },
    totalScoreForSupportTree: null,
  },
  reducers: {
    setDelegatedSupportClick: (state, action) => {
      state.currentDelegatedSupportedClick = action.payload;
    },
    setTotalCampScore: (state, action) => {
      state.totalScoreForSupportTree = action.payload;
    },
  },
});

export const { setDelegatedSupportClick, setTotalCampScore } = treeCard.actions;

export default treeCard.reducer;
