import { handleError } from "../../utils/generalUtility";
import NetworkCall from "../networkCall";
import TermsAndPrivacyRequest from "../request/termsAndPrivacyRequest";
import { createToken } from "./userApi";

export const getTermsAndServicesContent = async (tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getTermsAndServicesContent(token)
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
export const getPrivacyPolicyContent = async (tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }
  try {
    const res = await NetworkCall.fetch(
      TermsAndPrivacyRequest.getPrivacyPolicyContent(token)
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
