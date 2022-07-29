import { createSlice } from "@reduxjs/toolkit";

export const treeCard = createSlice({
  name: "supportTreeCard",
  initialState: {
    currentDelegatedSupportedClick: { delegatedSupportClick: "false" },
  },
  reducers: {
    setDelegatedSupportClick: (state, action) => {
      state.currentDelegatedSupportedClick = action.payload;
    },
  },
});

export const { setDelegatedSupportClick } = treeCard.actions;

export default treeCard.reducer;
