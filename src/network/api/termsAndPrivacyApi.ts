import { handleError, isServer } from "../../utils/generalUtility";
import NetworkCall from "../networkCall";
import TermsAndPrivacyRequest from "../request/termsAndPrivacyRequest";

export const getTermsAndServicesContent = async () => {
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getTermsAndServicesContent()
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
export const getPrivacyPolicyContent = async () => {
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getPrivacyPolicyContent()
    );
    console.log("res =>", res);
    return res.data;
  } catch (error) {
    console.log("eroro");
    handleError(error);
  }
};
