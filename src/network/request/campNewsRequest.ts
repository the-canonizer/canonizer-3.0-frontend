import K from "../../constants";
import Request from ".";
import { connect } from "react-redux";

export class campNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static addNewsFeed(reqBody, token) {
    return new Request(
      K.Network.URL.AddNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getEditCampNewsFeed(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditCampNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static updateNewsFeed(reqBody, token) {
    return new Request(
      K.Network.URL.UpdateNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static deleteNewsFeed(reqBody, token) {
    return new Request(
      K.Network.URL.DeleteNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
