import K from "../../../constants";
import Request from "../../request";

export default class UserRequest extends Request {
  constructor(url, met, body, head, obj, token) {
    super(url, met, body, head, obj, token);
  }

  static createToken() {
    const body = {
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
    };

    return new UserRequest(
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

    return new UserRequest(
      K.Network.URL.LoginUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }

  static logoutCall(token, error: string = "") {
    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
      K.Network.URL.VerifyRegisterUser,
      K.Network.Method.POST,
      body,
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
    return new UserRequest(
      K.Network.URL.UpdateUser + id,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {},
      false
    );
  }

  static changePassword(values, authToken) {
    const body = {
      ...values,
    };

    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
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

    return new UserRequest(
      K.Network.URL.GetAlgorithmsList,
      K.Network.Method.GET,
      body,
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }
}
