import K from "../../constants";
import Request from ".";

export class campManageStatementRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getEditStatement(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditStatement + "/" + reqBody,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static getEditCamp(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditCamp + "/" + reqBody,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static updateStatement(reqBody, token) {
    return new Request(
      K.Network.URL.UpdateStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static updateCamp(reqBody, token) {
    return new Request(
      K.Network.URL.UpdateCamp,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
