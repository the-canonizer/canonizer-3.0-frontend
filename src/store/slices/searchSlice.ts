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
      topic_total:0,
      camp_total:0,
      statement_total:0,
      nickname_total:0,
    },
    searchCountForMetaData: {
      topic_total: 0,
      camp_total: 0,
      statement_total: 0,
      nickname_total: 0,
    },

    searchValue: "",
    pageNumber: 1,
    searchQueryValue: "",
    selectedTopicFromAdvnaceFilterNickname: [],
    selectNicknameIdFromGetApi: [],
    selectNickNameIdFromDirectSupportTree: [],
    clickAdvanceFilterOption: false,
    openSearchForMobileView: false,
    selectedTopicFromAdvanceFilterAlgorithm: [],
    selectedCampFromAdvanceFilterAlgorithm: [],
    selectedStatementFromAdvanceFilterAlgorithm: [],
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
        size: action.payload.size,
        total: action.payload.total,
        topic_total : action.payload.topic_total,
        camp_total: action.payload.camp_total,
        statement_total : action.payload.statement_total,
        nickname_total: action.payload.nickname_total,
      };
    },
    setSearchCountForMetaData: (state, action) => {
      state.searchCountForMetaData = {
        topic_total: action.payload.topic_total,
        camp_total: action.payload.camp_total,
        statement_total: action.payload.statement_total,
        nickname_total: action.payload.nickname_total,
      };
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setSearchQueryValue: (state, action) => {
      state.searchQueryValue = action.payload;
    },
    setSelectedTopicFromAdvnaceFilterNickname: (state, action) => {
      state.selectedTopicFromAdvnaceFilterNickname = action.payload;
    },
    setSelectNicknameIdFromGetApi: (state, action) => {
      state.selectNicknameIdFromGetApi = action.payload;
    },
    setClickAdvanceFilterOption: (state, action) => {
      state.clickAdvanceFilterOption = action.payload;
    },
    setSelectNickNameIdFromDirectSupportTree: (state, action) => {
      state.selectNickNameIdFromDirectSupportTree = action.payload;
    },
    setOpenSearchForMobileView: (state, action) => {
      state.openSearchForMobileView = action.payload;
    },
    setSelectedTopicFromAdvanceFilterAlgorithm: (state, action) => {
      state.selectedTopicFromAdvanceFilterAlgorithm = action.payload;
    },
    setSelectedCampFromAdvanceFilterAlgorithm: (state, action) => {
      state.selectedCampFromAdvanceFilterAlgorithm = action.payload;
    },
    setSelectedStatementFromAdvanceFilterAlgorithm: (state, action) => {
      state.selectedStatementFromAdvanceFilterAlgorithm = action.payload;
    },
  },
});

export const {
  setSearchData,
  setSearchValue,
  setPageNumber,
  setSearchDataAll,
  setSearchMetaData,
  setSearchQueryValue,
  setSelectedTopicFromAdvnaceFilterNickname,
  setSelectNicknameIdFromGetApi,
  setClickAdvanceFilterOption,
  setSelectNickNameIdFromDirectSupportTree,
  setOpenSearchForMobileView,
  setSelectedStatementFromAdvanceFilterAlgorithm,
  setSelectedCampFromAdvanceFilterAlgorithm,
  setSelectedTopicFromAdvanceFilterAlgorithm,
  setSearchCountForMetaData,
} = searchSlice.actions;

export default searchSlice.reducer;
