import K from "../../constants";
import Request from ".";
import { getCookies } from "src/utils/generalUtility";

export default class TopicRequest extends Request {
  constructor(params) {
    super(params);
  }

  static createTopic(body) {
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
  static GetHotTopic(page, parPage, token: string = "") {
    return new Request(
      K.Network.URL.GetHotTopic + `?page=${page}&per_page=${parPage}`,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  //GetPreferedTopic
  static GetPreferedTopic(page, parPage, token: string = "") {
    return new Request(
      K.Network.URL.GetPrefTopic + `?page=${page}&per_page=${parPage}`,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  // GetFeaturedTopic
  static GetFeaturedTopic(token: string = "") {
    return new Request(
      K.Network.URL.GetFeaturedTopic,
      K.Network.Method.GET,
      {},
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
