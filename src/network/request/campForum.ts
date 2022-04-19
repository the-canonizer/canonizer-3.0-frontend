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
      K.Network.URL.ThreadCreate,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }

  static getThreads(queries) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.ThreadsList + queries,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }
  static updateThread(body, id) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.ThreadUpdate + "/" + id,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }
}
