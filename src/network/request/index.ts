import K from "../../constants";

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
    let bearerToken = "";
    if (token) {
      bearerToken = token;
    }
    // TODO: Remove after testing
    // if (token) {
    //   //coming from server side use it
    //   bearerToken = token;
    // } else {
    //   const cc: any = getCookies();

    //   if (cc?.loginToken) {
    //     if (isTokenValid(cc.loginToken)) {
    //       bearerToken = cc.loginToken;
    //     }else{
    //       console.log("---token expired---")
    //     }
    //   } else if (!relativeURL?.includes("client-token")) {
    //     Request.counter++;
    //     // create token
    //     (async () => {
    //       console.log("2:create token from network layer:");
    //       const res = await createToken(null, null, false);
    //       bearerToken = res;
    //     })();
    //   }
    // }

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
