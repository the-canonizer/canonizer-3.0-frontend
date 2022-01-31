import K from "../../constants";
import Request from ".";

import { redirectToLogin } from "../../utils/generalUtility";

export default class UserRequest extends Request {
  constructor(params) {
    super(params);
  }

  static loginUser(email: any, password: any) {
    const body = {
      email,
      password,
    };
    return new Request(
      K.Network.URL.LoginUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
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
      {}
    );
  }

  static logoutCall(error: string = "") {
    //user's logout logic
    redirectToLogin(error);
  }
}
