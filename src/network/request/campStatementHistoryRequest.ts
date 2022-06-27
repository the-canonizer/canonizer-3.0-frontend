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
  static getLiveCampStatement(reqBody) {
    return new Request(
      K.Network.URL.GetCampStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
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
}
