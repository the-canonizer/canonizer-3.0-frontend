import K from "../../constants";
import Request from ".";
import { connect } from "react-redux";
import { updateStatementApi } from "../api/campManageStatementApi";

export class campManageStatementRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getEditStatement(reqBody, token) {
    console.log("reqbody2 =>", reqBody);
    return new Request(
      K.Network.URL.GetEditStatement + "/" + reqBody,
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
}
//   static updateNewsFeed(reqBody, token) {
//     return new Request(
//       K.Network.URL.UpdateNewsFeed,
//       K.Network.Method.POST,
//       reqBody,
//       K.Network.Header.Type.Json,
//       {},
//       token
//     );
//   }

//   static deleteNewsFeed(reqBody, token) {
//     return new Request(
//       K.Network.URL.DeleteNewsFeed,
//       K.Network.Method.POST,
//       reqBody,
//       K.Network.Header.Type.Json,
//       {},
//       token
//     );
//   }
// }
