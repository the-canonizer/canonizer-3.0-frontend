import { setLoggedInUser, logoutUser } from "../../store/slices/authSlice";

export const login = () => {
  return async (dispatch) => {
    try {
      const user = await NetworkCall.fetch(
        UserRequest.loginUser(email, password)
      );
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
      dispatch(logoutUser());
    } catch (error) {
      message.error(error.message);
    }
  };
};
