import { createSlice } from "@reduxjs/toolkit";

export const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
  },
  reducers: {
    setTags: (state, action) => {
      state.tags = action.payload;
    },
  },
});

export const { setTags } = tagsSlice.actions;

export default tagsSlice.reducer;
