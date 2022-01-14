import { message } from "antd";

import { isServer } from "../../../utils/generalUtility";
import {
  setAuthToken,
  removeAuthToken,
  setLoggedInUser,
  logoutUser,
} from "../../../store/slices/authSlice";
import NetworkCall from "../../networkCall";
import UserRequest from "./request";

export const createToken = async () => {
  try {
    const token = await NetworkCall.fetch(UserRequest.createToken());
    return token.data;
  } catch (error) {
    console.log(error);
    message.error(error.message);
  }
};

export const login = (email: string, password: string) => {
  return async (dispatch) => {
    try {
      const authToken = await createToken();

      const res = await NetworkCall.fetch(
        UserRequest.loginUser(email, password, authToken.access_token)
      );

      !isServer &&
        window.localStorage.setItem("token", res.data.auth.access_token);
      let payload = {
        ...res.data.user,
        token: res.data.auth.access_token,
        refresh_token: res.data.auth.refresh_token,
      };

      dispatch(setLoggedInUser(payload));
      dispatch(setAuthToken(authToken.access_token));

      return res;
    } catch (err) {
      console.log(err.error.data);
      message.error(err.error.data.message);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      // await NetworkCall.fetch(UserRequest.logoutUser(token));
      !isServer && window.localStorage.removeItem("token");
      dispatch(logoutUser());
    } catch (error) {
      message.error(error.message);
    }
  };
};
