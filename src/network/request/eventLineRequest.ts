import K from "../../constants";
import Request from ".";

export default class EventLine extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getEventLine(reqBody) {
    return new Request(
      K.Network.URL.EventLineEndpoint,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
