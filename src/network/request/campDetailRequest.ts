import K from "../../constants";
import Request from ".";
export default class TreeRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getTrees(reqBody) {
    return new Request(
      K.Network.URL.GetTree,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.GetNewsFeed,
      K.Network.Method.GET,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCampStatement(reqBody) {
    return new Request(
      K.Network.URL.GetCampStatement,
      K.Network.Method.GET,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCampSupportingTree(reqBody) {
    return new Request(
      K.Network.URL.GetSupportingTree,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
