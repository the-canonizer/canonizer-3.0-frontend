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

    token ? (bearerToken = token) : (bearerToken = auth?.loggedInUser?.token);

    headers = {
      ...(defaultHeaderType === K.Network.Header.Type.Json ||
      defaultHeaderType === K.Network.Header.Type.formData
        ? K.Network.Header.Default(bearerToken)
        : K.Network.Header.Authorization(bearerToken)),
      ...headers,
    };
    this.url = relativeURL;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }
}
