import axios from "axios";
import K from "../utilities/constants";
import { message } from "antd";
import { camelCaseKeys } from "../utilities/generalUtility";
import { trackPromise } from "react-promise-tracker";
import User from "../models/user/user";

export default class NetworkCall {
  static async fetch(request, useLoading = true) {
    try {
      const response = useLoading
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

      console.log("NetworkCall Data: ", response.data);
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
        User.logoutCall("Invalid User");
      } else if (error.status === K.Network.StatusCode.Unauthorized) {
        User.logoutCall("User unauthorized");
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
}
NetworkCall.axios = axios.create({
  baseURL: K.Network.URL.BaseAPI,
  timeout: K.Network.Timeout,
  headers: {},
});
