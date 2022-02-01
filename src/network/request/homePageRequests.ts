import K from "../../constants";
import Request from ".";
export default class HomePageRequests extends Request {
  constructor(params) {
    super(params);
  }

  static getCanonizedTopics(reqBody) {
    return new Request(
      K.Network.URL.GetCanonizedTopics,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.formData,
      {}
    );
  }

  static getCanonizedNameSpaces() {
    return new Request(
      K.Network.URL.GetCanonizedNameSpaces,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCanonizedWhatsNewContent() {
    return new Request(
      K.Network.URL.GetWhatsNewContent,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json
    );
  }

  static getHelpCardContent() {
    return new Request(
      K.Network.URL.GetHelpCardContent,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
