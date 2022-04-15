import K from "../../constants";
import Request from ".";

export default class campNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static addNewsRequest(reqBody) {
    return new Request(
      K.Network.URL.AddNewsFeeds,
      K.Network.Method.POST,
   reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

 

  static getCampNewsData(reqBody) {
    return new Request(
      K.Network.URL.GetCampNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static updateNewsData(reqBody) {
    return new Request(
      K.Network.URL.UpdateNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static deleteNewsData(reqBody) {
    return new Request(
      K.Network.URL.DeleteNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
