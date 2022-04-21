import K from "../../constants";
import Request from ".";

export default class UserRequest extends Request {
  constructor(url, met, body, head, obj, token) {
    super(url, met, body, head, obj, token);
  }

  static createToken() {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
    };

    return new Request(
      K.Network.URL.CreateToken,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      ""
    );
  }

  static loginUser(email: string, password: string, authToken) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      username: email,
      password,
    };

    return new Request(
      K.Network.URL.LoginUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static logoutCall(token, error: string = "") {
    return new Request(
      K.Network.URL.LogoutUser,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static registerUser(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.RegisterUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static verifyUser(values, authToken) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      ...values,
    };

    return new Request(
      K.Network.URL.VerifyRegisterUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static userSocialLogin(values, authToken) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      ...values,
    };

    return new Request(
      K.Network.URL.UserSocialLogin,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static userSocialLoginCallback(values, authToken) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      ...values,
    };

    return new Request(
      K.Network.URL.UserSocialLoginCallback,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static getCountryCodes(authToken) {
    return new Request(
      K.Network.URL.CountryCodes,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static updateUser(user: any, user_image: any, id: string) {
    const body = {
      user,
      user_image,
    };
    return new Request(
      K.Network.URL.UpdateUser + id,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {},
      ""
    );
  }

  static changePassword(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.ChangePassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static GetUserProfileInfo(authToken) {
    const body = {};

    return new Request(
      K.Network.URL.GetUserProfileInfo,
      K.Network.Method.GET,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static UpdateUserProfileInfo(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.UpdateUserProfileInfo,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static GetMobileCarrier(authToken) {
    const body = {};

    return new Request(
      K.Network.URL.GetMobileCarrier,
      K.Network.Method.GET,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static SendOTP(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.SendOTP,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static VerifyOTP(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.VerifyOTP,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static GetAlgorithmsList(authToken) {
    const body = {};

    return new Request(
      K.Network.URL.GetCanonizedAlgorithms,
      K.Network.Method.GET,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static GetLanguageList(authToken) {
    const body = {};

    return new UserRequest(
      K.Network.URL.GetLanguageList,
      K.Network.Method.GET,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  // forgot password
  static forgotPasswordSendOTP(body, token) {
    return new Request(
      K.Network.URL.SendForgotPasswordOTP,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static forgotPasswordVerifyOTP(body, token) {
    return new Request(
      K.Network.URL.VerifyForgotPasswordOTP,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static forgotPasswordUpdatePassword(body, token) {
    return new Request(
      K.Network.URL.UpdateForgotPassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static addNickName(values, authToken) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.AddNickName,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }
  static getNickNameList(authToken) {
    const tokenBearer="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiODI2M2NmMjBlODVkMjRhY2EwOTk0MzZlMWNjMWNjNmRjMmE3NDE5YzM1OTIwN2E4ODg0YWY5OTNiNjA5NzI5Yjk4NTJhYzUwOTFmN2JlMjciLCJpYXQiOjE2NTA1MjUwMzEuMzA3MzE1LCJuYmYiOjE2NTA1MjUwMzEuMzA3MzE5LCJleHAiOjE2ODIwNjEwMzEuMjk3MjM2LCJzdWIiOiIxMjMwIiwic2NvcGVzIjpbIioiXX0.P83KeK4hvp63lgPMu64gCfMilA8TfkSWWumga7jZP59gXf3xSPi7MR1FR1M6S02oU52ElSdbkDKAHwgJGbE_siOw-VrYk-PZPJWhdUH5hYAswXSxRZ9aYB1dm6NHzDrTuyS33GKTIm1qQKnFwNGomL7BnuoTys2BU49YVZxVusyiSKRF_vXqDBb39HNsCUCGOO-ZFM3I1iYEVF3EXgg5cHyRTAasKMUFe3RcGk5xDnpls18NVazH4IX6tsQeMI-mqDxAv6XqJ3g-egLMb4kRZcr6b7TwtvXSFXPd4YPCoBQJbeBHpKuWn6QP3UlPXCszgLe4qZI00CKAzpK38V6EkvwHuG_Bflfc8aK8LF4v2Al_8gLal3rh92ZkArk8xu7-553s2ZkOloKRicLp7ckssFKzXuYS5P8RLiLKWrt9OkPAEE7w143W8vIzqKaYc-7g-xQPyrVrfvE2P6pAR7wE0SwlYvvP8pSeYsQEUZEKuHHyOrVnD-Cm8qjngUgYGL3cewSvVwfYOcXZFfN8rYECFsam-BAQ6T3p1inlbDTXVVgqnsrQFZ9oJU9R6Qu6k28WIVlA8eDfu_vQmpW-3mn2IMUoNiTvqxcQ3pt7mnMaL9BdrsjB-uTbkeFJwVn77jIi8WXrYLfM36ag9vDsZFpxmvdlORUxSKwfBefN5BRAadw"

    return new Request(
      K.Network.URL.GetNickNameList,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      //authToken
      tokenBearer
    );
  }
  static updateNickName(values, authToken, id: string) {
    const body = {
      ...values,
    };

    return new Request(
      K.Network.URL.UpdateNickName + id,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  // resend otp for registration
  static resendOTPForRegistration(body, token) {
    return new Request(
      K.Network.URL.ResendOTPForRegistration,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getDirectSupportedCampsList(authToken) {
    return new Request(
      K.Network.URL.GetDirectSupportedCamps,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static getDelegatedSupportCampsList(authToken) {
    return new Request(
      K.Network.URL.GetDelegatedSupportCamps,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static userSocialAccountsList(token) {
    return new Request(
      K.Network.URL.GetSocialLinkedAccounts,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static userSocialAccountDelete(token, id) {
    return new Request(
      K.Network.URL.DeleteSocialLinkedAccount + "/" + id,
      K.Network.Method.DELETE,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static SocialLinkUser(values, authToken) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      ...values,
    };

    return new Request(
      K.Network.URL.LinkUsersFromSocial,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static UserDeactivate(body, authToken) {
    return new Request(
      K.Network.URL.DeactivateUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }
}
