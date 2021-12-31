import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import CryptoJS from "crypto-js";
import K from "../../constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedInUser: null,
    authenticated: "test",
    token: "jhsdhbud7y7sjhbjfbds7y87ysjdbfjd7y78yfds",
    permissions: ["view_tree"],
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        K.EncryptionConstants.AESEncryptionKey
      );
      state.loggedInUser = encryptedUser;
      state.token = action.payload.token;
      state.authenticated = true;
    },
    logoutUser: (state, action) => {
      state.loggedInUser = null;
      state.token = null;
      state.authenticated = false;
    },
  },
});

export const { setLoggedInUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
