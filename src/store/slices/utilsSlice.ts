import { createSlice } from "@reduxjs/toolkit";

const defaultValue = {
  logout_type: false,
  email_id: "",
  remember_me: null,
  social_login_keys: null,
  redirect_type: false,
  redirect_tab_setting: "",
  score_checkbox: false,
  archived_checkbox: false,
  sortLatestTopic:false,
  sortScoreViewTopic:false,
  reasonData: {},
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    ...defaultValue,
  },
  reducers: {
    setValue: (state, action) => {
      state[action.payload.label] = action.payload.value;
    },
    setScoreCheckBox: (state, action) => {
      state.score_checkbox = action.payload;
    },
    setReasonData: (state, action) => {
      state.reasonData = action.payload;
    },
    setArchivedCheckBox: (state, action) => {
      state.archived_checkbox = action.payload;
    },
    setSortLatestTopic: (state, action) => {
      state.sortLatestTopic = action.payload;
    },
    setScoreViewTopic: (state, action) => {
      state.sortScoreViewTopic = action.payload;
    },
  },
});

export const {
  setValue,
  setScoreCheckBox,
  setReasonData,
  setArchivedCheckBox,
  setSortLatestTopic,
  setScoreViewTopic,
} = utilsSlice.actions;

export default utilsSlice.reducer;
