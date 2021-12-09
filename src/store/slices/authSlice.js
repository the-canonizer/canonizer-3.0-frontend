import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import CryptoJS from "crypto-js";
import isServer from "../../utils/generalUtility";
import K from "../../constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedInUser: null,
    token: null,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        K.EncryptionConstants.AESEncryptionKey
      );
      state.loggedInUser = encryptedUser;
      state.token = action.payload.token;
    },
    logoutUser: (state, action) => {
      state.loggedInUser = null;
      state.token = null;
      !isServer && localStorage.clear();
    },
  },
});

export const { setLoggedInUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
