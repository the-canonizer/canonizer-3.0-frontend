import NetworkCall from "../networkCall";
import MetaTagsRequest from "../request/metaTagsRequest";
import { createToken } from "./userApi";

export const metaTagsApi = async (body, tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const metaContent = await NetworkCall.fetch(
      MetaTagsRequest.getMetaTagsContent(body, token)
    );
    return metaContent;
  } catch (error) {
    return error?.error?.data;
  }
};
