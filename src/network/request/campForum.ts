import K from "../../constants";
import Request from ".";
import { store } from "../../store";

export default class TreeRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.
  static createThread(body) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.ForumCreate,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }
}
