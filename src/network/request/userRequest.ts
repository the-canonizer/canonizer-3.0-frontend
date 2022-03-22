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
    return new Request(
      K.Network.URL.GetNickNameList,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      authToken
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
}
