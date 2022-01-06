import { setLoggedInUser, logoutUser } from "../../store/slices/authSlice";
import { isServer } from "../../utils/generalUtility";
import NetworkCall from "../networkCall";
import UserRequest from "../request/userRequest";
import { message } from "antd";

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const user = await NetworkCall.fetch(
        UserRequest.loginUser(email, password)
      );
      !isServer && window.localStorage.setItem("token", user?.token);
      dispatch(setLoggedInUser(user));
      return user;
    } catch (error) {
      message.error(error.message);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await NetworkCall.fetch(UserRequest.logoutUser(token));
      !isServer && window.localStorage.removeItem("token");
      dispatch(logoutUser());
    } catch (error) {
      message.error(error.message);
    }
  };
};
