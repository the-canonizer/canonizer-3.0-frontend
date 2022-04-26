import K from "../../constants";
import Request from ".";
import { connect } from "react-redux";

export class campNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static addNewsDataRequest(reqBody) {
    return new Request(
      K.Network.URL.AddNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static getCampNewsData(reqBody) {
    return new Request(
      K.Network.URL.GetCampNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }
  static getCampEditNewsData(reqBody) {
    return new Request(
      K.Network.URL.GetCampEditNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static updateNewsData(reqBody) {
    return new Request(
      K.Network.URL.UpdateNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static deleteNewsData(reqBody) {
    return new Request(
      K.Network.URL.DeleteNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }
}

const mapStateToProps = (state) => {
  // const { auth } = state;
  // return auth;
  myState: state.auth;
};
export default connect(mapStateToProps)(campNewsRequest);
