import axios from "axios";
import K from "../constants";
import { message } from "antd";
import { trackPromise } from "react-promise-tracker";
import UserRequest from "./request/userRequest";
import { camelCaseKeys } from "../utils/generalUtility";

export default class NetworkCall {
  static async fetch(request, useLoading = true) {
    try {
      const response: any = useLoading
        ? await trackPromise(
            NetworkCall.axios({
              method: request.method,
              url: request.url,
              data: request.body,
              headers: request.headers,
              validateStatus: (status) => {
                return (status >= 200 && status < 300) || status === 304;
              },
            })
          )
        : await NetworkCall.axios({
            method: request.method,
            url: request.url,
            data: request.body,
            headers: request.headers,
            validateStatus: (status) => {
              return (status >= 200 && status < 300) || status === 304;
            },
          });

      return response.data;
    } catch (err) {
      let error = err.response;

      console.log("NetworkCall Error: ", error);
      if (error === undefined) {
        message.error("Cannot connect to server");
        return Promise.reject({
          error: error,
        });
      } else if (error.status === K.Network.StatusCode.Invalid) {
        UserRequest.logoutCall("Invalid User");
      } else if (error.status === K.Network.StatusCode.Unauthorized) {
        UserRequest.logoutCall("User unauthorized");
      }

      if ("errors" in error.data)
        error.data.errors = camelCaseKeys(error.data.errors);
      return Promise.reject({
        error: error,
        message: error.data.errors,
        statusCode: error.status,
      });
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
