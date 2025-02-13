import axios from "axios";
import { trackPromise } from "react-promise-tracker";

import K from "../constants";
import {
  camelCaseKeys,
  getCookies,
  isServer,
  isTokenValid,
} from "../utils/generalUtility";
import { createNewToken, logout } from "./api/userApi";
import { store } from "../store";
import { updateStatus } from "../store/slices/uiSlice";
import { setLoadingAction } from "src/store/slices/loading";

export default class NetworkCall {
  static counter = 1;
  static isRefreshingToken = false;
  static refreshTokenPromise = null;

  static async fetch(request, useLoading = true) {
    store.dispatch(setLoadingAction(true));
    const axiosCall = (newRequest) => {
      return NetworkCall.axios({
        method: request.method,
        url: request.url,
        data: request.body,
        headers: { ...newRequest },
        validateStatus: (status) => {
          return status == 200;
        },
      });
    };

    try {
      let newHeader;

      // Handle token validation and refresh logic
      if (request?.url?.includes("client-token")) {
        newHeader = K.Network.Header.Default("");
      } else {
        const currentToken =
          request.headers.Authorization?.split(" ")?.at(1) ||
          (getCookies() as any)?.loginToken;

        // Check if the token is invalid
        if (!isTokenValid(currentToken)) {
          // Handle token refresh: Ensure only one token is created
          if (!NetworkCall.isRefreshingToken) {
            NetworkCall.isRefreshingToken = true;

            // Initiate token refresh and save the resulting promise
            NetworkCall.refreshTokenPromise = createNewToken(null, null)
              .then((newToken) => {
                newHeader = K.Network.Header.Default(newToken);
                NetworkCall.isRefreshingToken = false;
                return newToken;
              })
              .catch((err) => {
                NetworkCall.isRefreshingToken = false;
                throw err;
              });
          }

          // Wait for the existing token refresh promise to resolve
          const newToken = await NetworkCall.refreshTokenPromise;
          newHeader = K.Network.Header.Default(newToken);
        } else {
          // Use existing valid token
          newHeader = isServer()
            ? request.headers
            : K.Network.Header.Default((getCookies() as any)?.loginToken);
        }
      }

      const response: any = useLoading
        ? await trackPromise(axiosCall(newHeader))
        : await axiosCall(newHeader);

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
        // let authenticatedApi =
        //   error.config.url?.includes("support-reason-list") ||
        //   error.config.url?.includes("support/check") ||
        //   error.config.url?.includes("camp/get-topic-nickname-used");

        if (
          !(
            error.config.url?.includes("/user/login") ||
            error.config.url?.includes("/forgot-password/verify-otp")
          )
        ) {
          logout(
            "Invalid User",
            error.status,
            NetworkCall.counter,
            // authenticatedApi
          );
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
NetworkCall.axios = axios.create({
  baseURL: K.Network.URL.BaseAPI,
  timeout: +K.Network.URL.Timeout,
  headers: {},
});
