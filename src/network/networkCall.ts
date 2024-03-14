import axios from "axios";
import { trackPromise } from "react-promise-tracker";

import K from "../constants";
import { camelCaseKeys } from "../utils/generalUtility";
import { logout } from "./api/userApi";
import { store } from "../store";
import { updateStatus } from "../store/slices/uiSlice";
import { setLoadingAction } from "src/store/slices/loading";

export default class NetworkCall {
  static counter = 1;

  static async fetch(request, useLoading = true) {
    store.dispatch(setLoadingAction(true));
    const axiosCall = () => {
      return NetworkCall.axios({
        method: request.method,
        url: request.url,
        data: request.body,
        headers: request.headers,
        validateStatus: (status) => {
          return status == 200;
        },
      });
    };

    try {
      const response: any = useLoading
        ? await trackPromise(axiosCall())
        : await axiosCall();
      if (response?.data?.auth?.access_token) {
        NetworkCall.counter = 1;
      }
      store.dispatch(updateStatus(response.data.status));
      store.dispatch(setLoadingAction(false));
      return response.data;
    } catch (err) {
      let error = err.response;
      if (error === undefined) {
        return Promise.reject({ error: error });
      } else if (error.status === K.Network.StatusCode.Invalid) {
        if (
          !(
            error.config.url?.includes("/user/login") ||
            error.config.url?.includes("/forgot-password/verify-otp")
          )
        ) {
          logout("Invalid User", error.status, NetworkCall.counter);
          NetworkCall.counter++;
        }

        store.dispatch(updateStatus(error.status));
      }
      if (typeof error.data === "object" && "errors" in error.data)
        error.data.errors = camelCaseKeys(error.data.errors);
      store.dispatch(setLoadingAction(false));
      return Promise.reject({ error: error });
    }
  }
  /* eslint-disable */
  static axios(arg0: {
    method: any;
    url: any;
    data: any;
    headers: any;
    validateStatus: (status: any) => boolean;
  }): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
/* eslint-enable */
NetworkCall.axios = axios.create({
  baseURL: K.Network.URL.BaseAPI,
  timeout: +K.Network.URL.Timeout,
  headers: {},
});
