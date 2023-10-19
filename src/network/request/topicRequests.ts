import K from "../../constants";
import Request from ".";
import { store } from "../../store";
import { getCookies } from "src/utils/generalUtility";

export default class TopicRequest extends Request {
  constructor(params) {
    super(params);
  }

  static createTopic(body) {
    let state = store.getState();
    const { auth } = state;

    const cc: any = getCookies();

    return new Request(
      K.Network.URL.CreateTopic,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      cc?.loginToken
    );
  }

  //getTopicsSuypported camps
  static GetActiveSupportTopic(body, token) {
    return new Request(
      K.Network.URL.GetActiveSupportTopic,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  //GetCheckSupportExists
  static GetCheckSupportExists(reqbody, authToken) {
    return new Request(
      K.Network.URL.GetCheckSupportExists + reqbody,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      authToken
    );
  }
  //GetHotTopic
  static GetHotTopic(token: string = "") {
    return new Request(
      K.Network.URL.GetHotTopic,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
