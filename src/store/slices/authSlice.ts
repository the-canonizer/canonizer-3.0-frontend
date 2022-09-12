import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import K from "../../constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    loggedInUser: null,
    authenticated: false,
    authToken: null,
    token: "",
    authRefreshToken: null,
    permissions: [""],
    socialUsers: [],
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = null;
    },
    setLoggedInUser: (state, action) => {
      // let encryptedUser = CryptoJS.AES.encrypt(
      //   JSON.stringify(action.payload),
      //   K.EncryptionConstants.AESEncryptionKey
      // );
      state.loggedInUser = action.payload;
      state.token = action.payload.token;
      state.authenticated = true;
      state.authRefreshToken = action.payload.refresh_token;
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.token = null;
      state.authenticated = false;
      state.authToken = null;
      state.authRefreshToken = null;
      state.socialUsers = [];
    },
    setSocialUsers: (state, action) => {
      state.socialUsers = action.payload;
    },
    removeSocialUsers: (state) => {
      state.socialUsers = [];
    },
    setLogout: (state) => {
      // From here we can take action only at this "auth" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    },
  },
});

export const {
  setAuthToken,
  removeAuthToken,
  setLoggedInUser,
  logoutUser,
  setSocialUsers,
  removeSocialUsers,
  setLogout,
} = authSlice.actions;

export default authSlice.reducer;
