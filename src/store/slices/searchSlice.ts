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
    searchDataAll: {
      camp: [],
      nickname: [],
      statement: [],
      topic: [],
      response: false,
    },
    searchMetaData: {
      page: 1,
      size: 1,
      total: 1,
    },
    searchValue: "",
    pageNumber: 1,
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
    setSearchDataAll: (state, action) => {
      state.searchDataAll = {
        camp: action.payload.camp,
        nickname: action.payload.nickname,
        statement: action.payload.statement,
        topic: action.payload.topic,
        response: true,
      };
    },
    setSearchMetaData: (state, action) => {
      state.searchMetaData = {
        page: action.payload.page,
        size: action.payload.nickname,
        total: action.payload.total,
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

export const {
  setSearchData,
  setSearchValue,
  setPageNumber,
  setSearchDataAll,
  setSearchMetaData,
} = searchSlice.actions;

export default searchSlice.reducer;
