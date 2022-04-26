import K from "../../constants";
import Request from ".";
import { store } from "../../store";

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
}
