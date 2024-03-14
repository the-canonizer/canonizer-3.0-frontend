import K from "../../constants";
import Request from ".";

export default class CampStatementHistoryRequest extends Request {
  constructor(params) {
    super(params);
  }

  static campHistory(body, token) {
    return new Request(
      K.Network.URL.CampStatementHistory,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getHistoryUrl(historyOf: string) {
    let historyUrl: string, liveHistoryUrl: string;
    if (historyOf == "statement") {
      historyUrl = "CampStatementHistory";
    } else if (historyOf == "camp") {
      historyUrl = "GetCampHistory";
    } else if (historyOf == "topic") {
      historyUrl = "GetTopicHistory";
    }
    return { historyUrl, liveHistoryUrl };
  }

  static getHistory(body, token, historyOf: string) {
    let { historyUrl } = CampStatementHistoryRequest.getHistoryUrl(historyOf);
    return new Request(
      K.Network.URL[historyUrl],
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static changeSupporters(body) {
    return new Request(
      K.Network.URL.ChangeSupporters,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static checkCampStatus(body) {
    return new Request(
      K.Network.URL.CheckCampStatus,
      K.Network.Method.POST,
      body,
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
  static commitChangeStatement(body) {
    return new Request(
      K.Network.URL.CommitChangeStatement,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
  static discardChangeStatement(body) {
    return new Request(
      K.Network.URL.DiscardChangeStatement,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
  static agreeToChange(body) {
    return new Request(
      K.Network.URL.AgreeToChange,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
