import K from "../../constants";
import Cookies from "js-cookie";
import queryParams from "../utilities/queryParams";
import User from "../models/user/user";

export default class UserRequest extends Request {
  constructor(params) {
    super(...params);
  }

  static loginUser(email, password) {
    const body = {
      email,
      password,
    };
    return new UserRequest(
      K.Network.URL.LoginUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false
    );
  }

  static updateUser(user, user_image, id) {
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
}
