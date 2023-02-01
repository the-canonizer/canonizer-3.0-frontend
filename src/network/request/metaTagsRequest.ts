import K from "../../constants";
import Request from ".";

export default class MetaTagsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getMetaTagsContent(payload, token) {
    return new Request(
      K.Network.URL.GetMetaContent,
      K.Network.Method.POST,
      payload,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
