import { getCookies } from "src/utils/generalUtility";
import K from "../../constants";
import { store } from "src/store";
import { createToken } from "../api/userApi";

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
    // const state = store.getState();
    // const { auth } = state;
    let bearerToken = "";
    const cc: any = getCookies();
    if (token) {
      //coming from server side use it
      bearerToken = token;
    } else {
      const cc: any = getCookies();
      if (cc?.loginToken) {
        bearerToken = cc.loginToken;
      } else {
        // create token
        (async () => {
          // const res = await createToken();
          // debugger;
          // bearerToken = res?.data?.access_token;
        })();
      }
    }

    // let bearerToken = token || cc?.loginToken;

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
