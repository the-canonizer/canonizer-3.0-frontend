import { isServer } from "src/utils/generalUtility";
import K from "../../constants";
import { store } from "../../store";

export default class Request {
  url: string = "";
  method: string = "";
  body: any;
  headers: any;

  constructor(
    relativeURL: string,
    method = K.Network.Method.GET,
    body = null,
    defaultHeaderType = K.Network.Header.Type.Json,
    headers = {},
    token = null
  ) {
    const state = store.getState();
    const { auth } = state;

    let bearerToken = "";
    if (isServer && token) {
      bearerToken = token;
    } else if (auth?.loggedInUser) {
      token ? (bearerToken = token) : (bearerToken = auth?.loggedInUser?.token);
    } else {
      bearerToken = auth?.authToken;
    }

    headers = {
      ...(defaultHeaderType === K.Network.Header.Type.Json ||
      defaultHeaderType === K.Network.Header.Type.formData
        ? K.Network.Header.Default(bearerToken)
        : K.Network.Header.Authorization()),
      ...headers,
    };
    this.url = relativeURL;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }
}
