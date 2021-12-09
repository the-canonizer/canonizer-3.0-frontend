import axios from "axios";
import Store from "../store";

class serviceCalls {
  static headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  static get(path, data = null, additionalOptions = false) {
    let url = process.env.API_ORIGIN + path;
    return axios({
      method: "get",
      url: url,
      headers: {
        ...serviceCalls.headers,
        Authorization: additionalOptions
          ? `Bearer ${Store.getState().userAuth.token}`
          : "",
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response;
      });
  }

  static post(path, data, additionalOptions = false) {
    let url = process.env.API_ORIGIN + path;
    return axios({
      method: "post",
      url: url,
      headers: {
        ...serviceCalls.headers,
        Authorization: additionalOptions
          ? `Bearer ${Store.getState().userAuth.token}`
          : "",
      },
      data: data,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response;
      });
  }
}

export default serviceCalls;
