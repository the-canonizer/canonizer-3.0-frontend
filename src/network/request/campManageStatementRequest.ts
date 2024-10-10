import K from "../../constants";
import Request from ".";

export class campManageStatementRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getEditStatement(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static getEditCamp(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditCamp,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static getEditTopic(reqBody, token) {
    return new Request(
      K.Network.URL.GetEditTopic,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static getParseCampStatement(reqBody) {
    return new Request(
      K.Network.URL.GetParseCampStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
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

  static updateTopic(reqBody, token) {
    return new Request(
      K.Network.URL.UpdateTopic,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
