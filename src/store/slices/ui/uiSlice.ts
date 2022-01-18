import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loginModalVisible: false,
    registrationModalVisible: false,
  },
  reducers: {
    showLoginModal: (state) => {
      state.loginModalVisible = true;
    },
    hideLoginModal: (state) => {
      state.loginModalVisible = false;
    },
    showRegistrationModal: (state) => {
      state.registrationModalVisible = true;
    },
    hideRegistrationModal: (state) => {
      state.registrationModalVisible = false;
    },
  },
});

export const {
  showLoginModal,
  hideLoginModal,
  hideRegistrationModal,
  showRegistrationModal,
} = uiSlice.actions;

export default uiSlice.reducer;
