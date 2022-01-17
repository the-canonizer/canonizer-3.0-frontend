import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import K from "../../constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedInUser: null,
    authenticated: false,
    authToken: null,
    token: "",
    authRefreshToken: null,
    permissions: [""],
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
    },
  },
});

export const { setAuthToken, removeAuthToken, setLoggedInUser, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;
