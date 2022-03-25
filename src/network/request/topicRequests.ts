import K from "../../constants";
import Request from ".";
import { store } from "../../store";

export default class TopicRequest extends Request {
  constructor(params) {
    super(params);
  }

  static createTopic(body) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.CreateTopic,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser.token
    );
  }
}
