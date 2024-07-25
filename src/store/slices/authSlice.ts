import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    loggedInUser: null,
    authenticated: false,
    token: "",
    authRefreshToken: null,
    permissions: [""],
    socialUsers: [],
    emailForOtp: null,
    isNewUser: false,
    currentReturnUrl: null,
    userNickNames: null,
    passwordEmail: null,
    isPasswordVerfied: null,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    removeAuthToken: (state) => {
      state.token = null;
    },
    setProfilePicture: (state, action) => {
      state.loggedInUser.profile_picture = action.payload;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
      state.token = action.payload.token;
      state.authenticated = true;
      state.authRefreshToken = action.payload.refresh_token;
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.token = null;
      state.authenticated = false;
      state.authRefreshToken = null;
      state.socialUsers = [];
    },
    setSocialUsers: (state, action) => {
      state.socialUsers = action.payload;
    },
    removeSocialUsers: (state) => {
      state.socialUsers = [];
    },
    setIsNewUser: (state, action) => {
      state.isNewUser = action.payload;
    },
    setLogout: () => {
      // From here we can take action only at this "auth" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    },
    setEmailForOTP: (state, action) => {
      state.emailForOtp = action.payload;
    },
    setCurrentReturnUrl: (state, action) => {
      state.currentReturnUrl = action.payload;
    },
    setUserNickNames: (state, action) => {
      state.userNickNames = action.payload;
    },
    setPasswordEmail: (state, action) => {
      state.passwordEmail = action.payload;
    },
    setIsPasswordVerfied: (state, action) => {
      state.isPasswordVerfied = action.payload;
    },
  },
});

export const {
  setAuthToken,
  removeAuthToken,
  setProfilePicture,
  setLoggedInUser,
  logoutUser,
  setSocialUsers,
  removeSocialUsers,
  setLogout,
  setEmailForOTP,
  setIsNewUser,
  setCurrentReturnUrl,
  setUserNickNames,
  setPasswordEmail,
  setIsPasswordVerfied,
} = authSlice.actions;

export default authSlice.reducer;
