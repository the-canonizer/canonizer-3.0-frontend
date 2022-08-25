import { createSlice } from "@reduxjs/toolkit";

export const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    is_link: false,
    logout_type: null,
    email: "",
    remember_me: null,
    social_login_keys: null,
    redirect_type: null,
    redirect_tab_setting: null,
  },
  reducers: {
    setValue: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    resetValue: (state, action) => {
      state.is_link = false;
      state.logout_type = null;
      state.email = "";
      state.remember_me = null;
      state.social_login_keys = null;
      state.redirect_type = null;
      state.redirect_tab_setting = null;
    },
  },
});

export const { setValue, resetValue } = utilsSlice.actions;

export default utilsSlice.reducer;
