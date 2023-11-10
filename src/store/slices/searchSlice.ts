import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchData: {
      camp: [],
      nickname: [],
      statement: [],
      topic: [],
      response: false,
    },
    searchValue: "",
  },
  reducers: {
    setSearchData: (state, action) => {
      state.searchData = {
        camp: action.payload.camp,
        nickname: action.payload.nickname,
        statement: action.payload.statement,
        topic: action.payload.topic,
        response: true,
      };
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setSearchData, setSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
