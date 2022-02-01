import { message } from "antd";

import { isServer, redirectToLogin } from "../../../utils/generalUtility";
import {
  setAuthToken,
  removeAuthToken,
  setLoggedInUser,
  logoutUser,
} from "../../../store/slices/authSlice";
import NetworkCall from "../../networkCall";
import UserRequest from "./request";
import { store } from "../../../store";

export const createToken = async () => {
  try {
    const token = await NetworkCall.fetch(UserRequest.createToken());
    return token.data;
  } catch (error) {
    console.error(error);
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
      console.error(err?.error?.data);
      message.error(err?.error?.data.message);
    }
  };
};

export const logout = (error = "") => {
  let state = store.getState();
  const { auth } = state;

  return async (dispatch) => {
    try {
      let res = await NetworkCall.fetch(
        UserRequest.logoutCall(auth.token, error)
      );
      !isServer && window.localStorage.removeItem("token");
      dispatch(logoutUser());
      dispatch(removeAuthToken());
      if (res.status_code === 200) {
        redirectToLogin(error);
      }
      return res;
    } catch (error) {
      message.error(error?.message);
    }
  };
};

export const register = (values: object) => {
  return async (dispatch) => {
    try {
      const authToken = await createToken();

      const res = await NetworkCall.fetch(
        UserRequest.registerUser(values, authToken.access_token)
      );

      return res;
    } catch (errors) {
      console.error(errors?.error?.data);
      message.error(errors?.error?.data?.message);
      let msgs = errors?.error?.data.error;
      if (msgs) {
        let keys = Object.keys(msgs);
        keys.forEach((key) => {
          message.error(msgs[key][0]);
        });
      }
    }
  };
};

export const verifyOtp = (values: object) => {
  return async (dispatch) => {
    try {
      const authToken = await createToken();

      const res = await NetworkCall.fetch(
        UserRequest.verifyUser(values, authToken.access_token)
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
      console.error(err?.error?.data);
      message.error(err?.error?.data?.message);
      let msgs = err?.error?.data?.error;
      if (msgs) {
        let keys = Object.keys(msgs);
        keys.forEach((key) => {
          message.error(msgs[key][0]);
        });
      }
    }
  };
};

export const changePassword = (values: object) => {
  return async (dispatch) => {
    try {
      let state = store.getState();
      const { auth } = state;
      const res = await NetworkCall.fetch(
        UserRequest.changePassword(values, auth.loggedInUser.token)
        //UserRequest.changePassword(values, auth.token)
      );
      return res;
    } catch (errors) {
      let msgs = errors?.error?.data?.error;
      if (msgs) {
        let keys = Object.keys(msgs);
        keys.forEach((key) => {
          message.error(msgs[key][0]);
        });
      } else {
        message.error(errors?.error?.data?.message);
      }
    }
  };
};

// social login path
export const socialLogin = async (values: object) => {
  // return async (dispatch) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.userSocialLogin(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    console.error(err?.error?.data);
    message.error(err?.error?.data?.message);
    let msgs = err?.error?.data?.error;
    if (msgs) {
      let keys = Object.keys(msgs);
      keys.forEach((key) => {
        message.error(msgs[key][0]);
      });
    }
  }
  // };
};

export const socialLoginCallback = (values: object) => {
  return async (dispatch) => {
    try {
      const authToken = await createToken();

      const res = await NetworkCall.fetch(
        UserRequest.userSocialLoginCallback(values, authToken.access_token)
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
      console.error(err?.error?.data);
      message.error(err?.error?.data?.message);
      let msgs = err?.error?.data?.error;
      if (msgs) {
        let keys = Object.keys(msgs);
        keys.forEach((key) => {
          message.error(msgs[key][0]);
        });
      }
    }
  };
};

export const getCountryCodes = async () => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.getCountryCodes(authToken.access_token)
    );

    return res;
  } catch (err) {
    console.error(err?.error?.data);
    message.error(err?.error?.data?.message);
    let msgs = err?.error?.data?.error;
    if (msgs) {
      let keys = Object.keys(msgs);
      keys.forEach((key) => {
        message.error(msgs[key][0]);
      });
    }
  }
};
export const GetUserProfileInfo = () => {
  return async (dispatch) => {
    let state = store.getState();
    const { auth } = state;
    const res = await NetworkCall.fetch(
      UserRequest.GetUserProfileInfo(auth.loggedInUser.token)
    )
      .then((value) => {
        return value;
      })
      .catch((errors) => {
        let msgs = errors
          ? errors.error
            ? errors.error.data
              ? errors.error.data.error
                ? errors.error.data.error
                : ""
              : ""
            : ""
          : "";
        if (msgs) {
          let keys = Object.keys(msgs);
          keys.forEach((key) => {
            message.error(msgs[key][0]);
          });
        } else {
          if (
            errors
              ? errors.error
                ? errors.error.data
                  ? errors.error.data.message
                    ? errors.error.data.message
                    : ""
                  : ""
                : ""
              : ""
          )
            message.error(errors.error.data.message);
          else {
            message.error("Something is wrong");
          }
        }
      });
    return res;
  };
};

export const UpdateUserProfileInfo = (values: object) => {
  return async (dispatch) => {
    let state = store.getState();
    const { auth } = state;
    const res = await NetworkCall.fetch(
      UserRequest.UpdateUserProfileInfo(values, auth.loggedInUser.token)
    )
      .then((value) => {
        return value;
      })
      .catch((errors) => {
        debugger;
        let msgs = errors
          ? errors.error
            ? errors.error.data
              ? errors.error.data.error
                ? errors.error.data.error
                : ""
              : ""
            : ""
          : "";
        debugger;
        if (msgs) {
          let keys = Object.keys(msgs);
          keys.forEach((key) => {
            message.error(msgs[key][0]);
          });
        } else {
          if (
            errors
              ? errors.error
                ? errors.error.data
                  ? errors.error.data.message
                    ? errors.error.data.message
                    : ""
                  : ""
                : ""
              : ""
          )
            message.error(errors.error.data.message);
          else {
            message.error("Something is wrong");
          }
        }
      });
    return res;
  };
};
