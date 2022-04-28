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
    token = ""
  ) {
    // const token = User.getToken();
    let state = store.getState();
    const { auth } = state;
    console.log("store", auth);
    headers = {
      ...(defaultHeaderType === K.Network.Header.Type.Json ||
      defaultHeaderType === K.Network.Header.Type.formData
        ? K.Network.Header.Default(token)
        : K.Network.Header.Authorization(token)),
      ...headers,
    };
    this.url = relativeURL;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }
}
