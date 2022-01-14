import K from "../../constants";
import Request from ".";
export default class TreeRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getTrees() {
    return new Request(
      K.Network.URL.GetTree,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
