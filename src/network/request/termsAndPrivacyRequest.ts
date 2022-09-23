import K from "../../constants";
import Request from ".";

export default class TermsAndPrivacyRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getPrivacyPolicyContent() {
    return new Request(
      K.Network.URL.GetPrivacyPolicyContent,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
  static getTermsAndServicesContent() {
    return new Request(
      K.Network.URL.GetTermsAndServicesContent,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
