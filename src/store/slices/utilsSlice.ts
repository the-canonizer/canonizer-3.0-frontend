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
    setIsLink: (state, action) => {
      state.is_link = action.payload.isLink;
    },
  },
});

export const { setIsLink } = utilsSlice.actions;

export default utilsSlice.reducer;
