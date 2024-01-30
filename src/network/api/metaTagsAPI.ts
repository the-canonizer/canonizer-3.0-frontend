import NetworkCall from "../networkCall";
import MetaTagsRequest from "../request/metaTagsRequest";

export const metaTagsApi = async (body, loginToken = null) => {
  try {
    const metaContent = await NetworkCall.fetch(
      MetaTagsRequest.getMetaTagsContent(body, loginToken)
    );
    return metaContent;
  } catch (error) {
    return error?.error?.data;
  }
};

export const getSitemapXML = async (loginToken = null) => {
  try {
    const metaContent = await NetworkCall.fetch(
      MetaTagsRequest.getSitemapXMLContent(loginToken)
    );
    return metaContent;
  } catch (error) {
    return error?.error?.data;
  }
};
