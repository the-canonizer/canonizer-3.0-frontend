import { getCookies, isServer } from "src/utils/generalUtility";
import K from "../../constants";
import { store } from "src/store";
import { createToken } from "../api/userApi";

export default class Request {
  static counter = 0;
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
    console.log('first', Request.counter)
    let bearerToken = "";
    const cc: any = getCookies();
    if (token) {
      //coming from server side use it
      bearerToken = token;
    } else {
      const cc: any = getCookies();
      if (cc?.loginToken) {
        bearerToken = cc.loginToken;
      } else if(Request.counter === 0 ) {
        Request.counter++;
        // create token
        (async () => {
          const res = await createToken();
          debugger;
          bearerToken = res?.data?.access_token;
        })();
      }
    }

    // let bearerToken = token || cc?.loginToken;

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
