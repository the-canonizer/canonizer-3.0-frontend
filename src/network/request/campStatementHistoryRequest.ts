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
      liveHistoryUrl = "GetCampStatement";
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
  static getLiveHistory(reqBody, historyOf: string) {
    let { liveHistoryUrl } =
      CampStatementHistoryRequest.getHistoryUrl(historyOf);
    return new Request(
      K.Network.URL[liveHistoryUrl],
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
  static commitChangeStatement(body) {
    return new Request(
      K.Network.URL.CommitChangeStatement,
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
