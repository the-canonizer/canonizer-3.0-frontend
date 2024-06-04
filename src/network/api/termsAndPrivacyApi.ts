import { handleError } from "../../utils/generalUtility";
import NetworkCall from "../networkCall";
import TermsAndPrivacyRequest from "../request/termsAndPrivacyRequest";

export const getTermsAndServicesContent = async (loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getTermsAndServicesContent(loginToken)
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
export const getPrivacyPolicyContent = async (loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getPrivacyPolicyContent(loginToken)
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
