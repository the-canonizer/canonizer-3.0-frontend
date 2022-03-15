import { message } from "antd";

import {
  handleError,
  isServer,
  handleCatchError,
} from "../../utils/generalUtility";
import {
  setAuthToken,
  removeAuthToken,
  setLoggedInUser,
  logoutUser,
} from "../../store/slices/authSlice";
import NetworkCall from "../networkCall";
import UserRequest from "../request/userRequest";
import { store } from "../../store";

export const createToken = async () => {
  try {
    const token = await NetworkCall.fetch(UserRequest.createToken());
    return token.data;
  } catch (error) {
    handleError(error);
  }
};

export const login = async (email: string, password: string) => {
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

    store.dispatch(setLoggedInUser(payload));
    store.dispatch(setAuthToken(authToken.access_token));

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const logout = async (error = "") => {
  let state = store.getState();
  const { auth } = state;

  try {
    let res = await NetworkCall.fetch(
      UserRequest.logoutCall(auth.token, error)
    );
    !isServer && window.localStorage.removeItem("token");
    store.dispatch(logoutUser());
    store.dispatch(removeAuthToken());
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const register = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.registerUser(values, authToken.access_token)
    );
    return res;
  } catch (error) {
    if (
      error &&
      error.error &&
      error.error.data &&
      error.error.data.status_code === 403
    ) {
      return error.error.data;
    }
    handleError(error);
  }
};

export const verifyOtp = async (values: object) => {
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

    store.dispatch(setLoggedInUser(payload));
    store.dispatch(setAuthToken(authToken.access_token));

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const changePassword = async (values: object) => {
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

// social login path
export const socialLogin = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.userSocialLogin(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const socialLoginCallback = async (values: object) => {
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

    store.dispatch(setLoggedInUser(payload));
    store.dispatch(setAuthToken(authToken.access_token));

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const getCountryCodes = async () => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.getCountryCodes(authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const GetUserProfileInfo = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetUserProfileInfo(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const UpdateUserProfileInfo = async (values: object) => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.UpdateUserProfileInfo(values, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const GetMobileCarrier = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetMobileCarrier(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const SendOTP = async (values: object) => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.SendOTP(values, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const VerifyOTP = async (values: object) => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.VerifyOTP(values, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const GetAlgorithmsList = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetAlgorithmsList(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const GetLanguageList = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetLanguageList(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

// forgot password
export const forgotPasswordSendOTP = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.forgotPasswordSendOTP(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const forgotPasswordVerifyOTP = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.forgotPasswordVerifyOTP(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const forgotPasswordUpdate = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.forgotPasswordUpdatePassword(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const addNickName = async (values: object) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.addNickName(values, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });

  return res;
};

export const getNickNameList = async () => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.getNickNameList(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const updateNickName = async (values: object, id: string) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.updateNickName(values, auth.loggedInUser.token, id)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleCatchError(errors);
    });
  return res;
};

export const resendOTPForRegistration = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.resendOTPForRegistration(values, authToken.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};
