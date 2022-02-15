import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loginModalVisible: false,
    registrationModalVisible: false,
    forgotModalVisible: false,
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
    showForgotModal: (state) => {
      state.forgotModalVisible = true;
    },
    hideForgotModal: (state) => {
      state.forgotModalVisible = false;
    },
  },
});

export const {
  showLoginModal,
  hideLoginModal,
  hideRegistrationModal,
  showRegistrationModal,
  showForgotModal,
  hideForgotModal,
} = uiSlice.actions;

export default uiSlice.reducer;
