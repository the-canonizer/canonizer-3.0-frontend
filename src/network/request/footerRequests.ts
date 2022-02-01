import K from "../../constants";
import Request from ".";
export default class FooterRequests extends Request {
  constructor(params) {
    super(params);
  }

  static getFooterSocialLinks() {
    return new Request(
      K.Network.URL.GetFooterSocialLinks,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
