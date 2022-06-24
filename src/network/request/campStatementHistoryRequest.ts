import K from "../../constants";
import Request from ".";

export default class CampStatementHistoryRequest extends Request {
  constructor(params) {
    super(params);
  }

  static statementHistory(body, token) {
    return new Request(
      K.Network.URL.CampStatementHistory,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static statementCompare(body) {
    return new Request(
      K.Network.URL.CompareStatement,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
  static commitChangeStatement(body) {
    return new Request(
      K.Network.URL.CommitChangeStatement,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
