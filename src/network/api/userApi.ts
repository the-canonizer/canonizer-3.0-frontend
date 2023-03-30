import { message } from "antd";

import { handleError, isServer } from "../../utils/generalUtility";
import {
  setAuthToken,
  removeAuthToken,
  setLoggedInUser,
  logoutUser,
  setSocialUsers,
  setLogout,
} from "../../store/slices/authSlice";
import { showMultiUserModal, updateStatus } from "../../store/slices/uiSlice";
import { setValue } from "../../store/slices/utilsSlice";
import NetworkCall from "../networkCall";
import UserRequest from "../request/userRequest";
import { store } from "../../store";
import { setFilterCanonizedTopics } from "../../store/slices/filtersSlice";

export const createToken = async () => {
  try {
    const token = await NetworkCall.fetch(UserRequest.createToken());
    store.dispatch(setAuthToken(token?.data?.access_token));
    localStorage.setItem("auth_token", token?.data?.access_token);
    return token.data;
  } catch (error) {
    handleError(error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.loginUser(email, password, authToken?.access_token)
    );

    let payload = {
      ...res.data.user,
      token: res.data.auth?.access_token,
      refresh_token: res.data?.auth?.refresh_token,
    };

    store.dispatch(setLoggedInUser(payload));

    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      (err.error.data.status_code === 403 || err.error.data.status_code === 402)
    ) {
      return err.error.data;
    }
    handleError(err);
  }
};

export const logout = async (error = "", status = null, count: number = 1) => {
  let state = store.getState();
  const { auth } = state;

  try {
    if (error) {
      store.dispatch(logoutUser());
      store.dispatch(removeAuthToken());
      store.dispatch(updateStatus(status));

      if (+state.ui.apiStatus === +status) {
        return;
      }

      count === 1 &&
        message.error("Your session has expired. Please log in again!");

      return true;
    }

    if (!isServer()) {
      localStorage.setItem("logout_type", "true");
      store.dispatch(setValue({ label: "logout_type", value: true }));
    }

    let res = await NetworkCall.fetch(UserRequest.logoutCall(auth.token));

    store.dispatch(setLogout());
    store.dispatch(logoutUser());
    store.dispatch(removeAuthToken());
    return res;
  } catch (error) {
    store.dispatch(logoutUser());
    store.dispatch(removeAuthToken());
    handleError(error);
  }
};

export const register = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.registerUser(values, authToken?.access_token)
    );

    return res;
  } catch (error) {
    if (
      error &&
      error.error &&
      error.error.data &&
      (error.error.data.status_code === 403 ||
        (error.error.data.status_code === 400 && error.error.data.error))
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
      UserRequest.verifyUser(values, authToken?.access_token)
    );

    let payload = {
      ...res.data.user,
      token: res.data.auth?.access_token,
      refresh_token: res.data?.auth?.refresh_token,
    };

    store.dispatch(setLoggedInUser(payload));

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const changePassword = async (values: object) => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.changePassword(values, auth.loggedInUser.token)
    //UserRequest.changePassword(values, auth.token)
  );
  return res;
};

// social login path
export const socialLogin = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.userSocialLogin(values, authToken?.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const socialLoginCallback = async (values: object, router) => {
  const state = store.getState();

  try {
    let token = null;
    let authToken = null;

    if (state.auth.token) {
      token = state.auth.token;
    } else {
      authToken = await createToken();
      token = authToken?.access_token;
    }

    const res = await NetworkCall.fetch(
      UserRequest.userSocialLoginCallback(values, token)
    );

    let payload = {
      ...res.data.user,
      token: res.data.auth?.access_token,
      refresh_token: res.data?.auth?.refresh_token,
    };

    store.dispatch(setLoggedInUser(payload));

    if (res && res.status_code === 200 && res?.data?.user?.default_algo) {
      store.dispatch(
        setFilterCanonizedTopics({
          algorithm: res?.data?.user?.default_algo,
        })
      );
    }

    return res;
  } catch (error) {
    if (
      (error &&
        error.error &&
        error.error.data &&
        error?.error?.data.status_code === 403) ||
      error?.error?.data.status_code === 422 ||
      error?.error?.data.status_code === 423
    ) {
      return error.error.data;
    }
    if (
      error &&
      error.error &&
      error.error.data &&
      (error.error.data.status_code === 400 ||
        error.error.data.status_code === 402)
    ) {
      router.push("/login");
    }

    handleError(error);
  }
};

export const getCountryCodes = async () => {
  try {
    const authToken = await createToken();
    const res = await NetworkCall.fetch(
      UserRequest.getCountryCodes(authToken?.access_token)
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
    UserRequest.GetUserProfileInfo(auth.loggedInUser?.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
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
      let payload = {
        ...state.auth.loggedInUser,
        first_name: value.data.first_name,
        last_name: value.data.last_name,
        phone_number: value.data.phone_number,
        birthday: value.data.birthday,
        email: value.data.email,
        token: auth.loggedInUser.token,
        refresh_token: auth.loggedInUser.refresh_token,
      };
      store.dispatch(setLoggedInUser(payload));
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

export const GetMobileCarrier = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetMobileCarrier(auth.loggedInUser?.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
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
      handleError(errors);
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
      handleError(errors);
    });
  return res;
};

export const GetAlgorithmsList = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetAlgorithmsList(auth.loggedInUser?.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

export const GetLanguageList = async () => {
  let state = store.getState();
  const { auth } = state;
  const res = await NetworkCall.fetch(
    UserRequest.GetLanguageList(auth.loggedInUser?.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

// forgot password
export const forgotPasswordSendOTP = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.forgotPasswordSendOTP(values, authToken?.access_token)
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
      UserRequest.forgotPasswordVerifyOTP(values, authToken?.access_token)
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
      UserRequest.forgotPasswordUpdatePassword(values, authToken?.access_token)
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
      handleError(errors);
    });

  return res;
};

export const getNickNameList = async () => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.getNickNameList(auth.loggedInUser?.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
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
      handleError(errors);
    });
  return res;
};

export const resendOTPForRegistration = async (values: object) => {
  try {
    const authToken = await createToken();

    const res = await NetworkCall.fetch(
      UserRequest.resendOTPForRegistration(values, authToken?.access_token)
    );

    return res;
  } catch (err) {
    handleError(err);
  }
};

export const getDirectSupportedCampsList = async () => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.getDirectSupportedCampsList(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

//removeDirectSupportedCampsFromEntireTopic
export const removeSupportedCampsEntireTopic = async (body) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.removeSupportedCampsEntireTopic(body, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

//removeOrUpdateDirectSupportCamps one or multiple's
export const removeOrUpdateDirectSupportCamps = async (body) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.removeOrUpdateDirectSupportCamps(body, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};
//add Support
export const addSupport = async (body) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.addSupport(body, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

//add Delegated Supported Camps
export const addDelegateSupportCamps = async (body) => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.addDelegatedSupport(body, auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

export const getDelegatedSupportCampsList = async () => {
  let state = store.getState();
  const { auth } = state;

  const res = await NetworkCall.fetch(
    UserRequest.getDelegatedSupportCampsList(auth.loggedInUser.token)
  )
    .then((value) => {
      return value;
    })
    .catch((errors) => {
      handleError(errors);
    });
  return res;
};

export const userSocialAccountsList = async () => {
  const state = store.getState();

  try {
    const res = await NetworkCall.fetch(
      UserRequest.userSocialAccountsList(state.auth.token)
    );

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const userSocialAccountDelete = async (id: string) => {
  const state = store.getState();

  try {
    const res = await NetworkCall.fetch(
      UserRequest.userSocialAccountDelete(state.auth.token, id)
    );

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const socialLoginLinkUser = async (values: object) => {
  const state = store.getState();

  try {
    let token = state.auth.token;

    const res = await NetworkCall.fetch(
      UserRequest.SocialLinkUser(values, token)
    );

    return res;
  } catch (error) {
    if (
      error &&
      error.error &&
      error.error.data &&
      error.error.data.status_code === 403
    ) {
      const data = error.error.data;

      const users = [data.data.already_link_user];

      store.dispatch(setSocialUsers(users));
      store.dispatch(showMultiUserModal());

      return data;
    }
    handleError(error);
  }
};

export const deactivateUser = async (body: object) => {
  const state = store.getState();

  try {
    const res = await NetworkCall.fetch(
      UserRequest.UserDeactivate(body, state.auth.token)
    );

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const uploadFile = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.UploadFile(body, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const getUploadFileAndFolder = async () => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.GetUploadFileAndFolder(auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};
export const createFolderApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.CreateFolder(body, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const deleteFolderApi = async (id) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.DeleteFolder(id, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const deleteUploadFileApi = async (id) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.DeleteUploadFile(id, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const getFileInsideFolderApi = async (id) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.GetFileInsideAFolder(id, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const GetAllSubscriptionsList = async (params = "") => {
  try {
    const res = await NetworkCall.fetch(
      UserRequest.AllSubscriptionsList(params)
    );
    return res;
  } catch (err) {
    if (err?.error?.data?.status_code === 400) {
      return err.error.data;
    } else {
      handleError(err);
    }
  }
};

export const unsubscribeTopicOrCampAPI = async (body: object) => {
  try {
    const res = await NetworkCall.fetch(
      UserRequest.unsubscribeTopicOrCamp(body),
      false
    );
    return res;
  } catch (err) {
    handleError(err);
  }
};

export const getUserSupportedCampList = async (params: string) => {
  try {
    const res = await NetworkCall.fetch(
      UserRequest.UserSupportedCampList(params)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const verifyEmailOnSocial = async (body) => {
  try {
    const res = await NetworkCall.fetch(UserRequest.postVerifyEmail(body));

    let payload = {
      ...res.data.user,
      token: res.data.auth?.access_token,
      refresh_token: res.data?.auth?.refresh_token,
    };

    store.dispatch(setLoggedInUser(payload));

    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const SendOTPForVerify = async (body) => {
  try {
    const res = await NetworkCall.fetch(UserRequest.OTPSendVerifyEmail(body));
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const SupportTreeAndScoreCount = async (body) => {
  try {
    const res = await NetworkCall.fetch(UserRequest.SupportTree(body), false);
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const removeSupportedCamps = async (body) => {
  try {
    const res = await NetworkCall.fetch(UserRequest.removeCamps(body));
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};

export const globalSearchUploadFiles = async (reqbody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      UserRequest.GlobalSearchUploadedFiles(reqbody, auth.loggedInUser?.token)
    );
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};
