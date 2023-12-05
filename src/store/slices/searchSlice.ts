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
    pageNumber:1
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
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
  },
});

export const { setSearchData, setSearchValue,setPageNumber } = searchSlice.actions;

export default searchSlice.reducer;
