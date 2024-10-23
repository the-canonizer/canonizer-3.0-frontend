import { getCookies, isTokenExpired } from "src/utils/generalUtility";
import K from "../../constants";
import { createToken } from "../api/userApi";
import {
  logoutUser,
  removeAuthToken,
  setLogout,
} from "src/store/slices/authSlice";
import { setIsChecked } from "src/store/slices/recentActivitiesSlice";
import { setHeaderData } from "src/store/slices/notificationSlice";
import { store } from "../../store";

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
      //coming from server side use it
      bearerToken = token;
    } else {
      const cc: any = getCookies();

      if (cc?.loginToken) {
        bearerToken = cc.loginToken;
      } else if (!relativeURL?.includes("client-token")) {
        Request.counter++;
        // create token
        (async () => {
          const res = await createToken();

          bearerToken = res?.data?.access_token;
        })();
      }
    }

    /* if (isTokenExpired(bearerToken)) {
      (async () => {
        const res = await createToken();
        if (res?.access_token) {
          store.dispatch(setLogout());
          store.dispatch(setIsChecked(false));
          store.dispatch(logoutUser());
          store.dispatch(removeAuthToken());
          store.dispatch(setHeaderData({ count: 0, list: [] }));
        }
        bearerToken = res?.data?.access_token;
      })();
    } */

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
