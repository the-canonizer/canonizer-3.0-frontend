import K from "../../constants";
import Request from ".";
import { connect } from "react-redux";

export class campNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static addNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.AddNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static getEditCampNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.GetEditCampNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static updateNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.UpdateNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

  static deleteNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.DeleteNewsFeed,
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
