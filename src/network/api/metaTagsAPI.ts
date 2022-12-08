import NetworkCall from "../networkCall";
import MetaTagsRequest from "../request/metaTagsRequest";

export const metaTagsApi = async (body) => {
  try {
    const metaContent = await NetworkCall.fetch(
       MetaTagsRequest.getMetaTagsContent(body)
    );
    return metaContent;
  } catch (error) {
    return error?.error?.data;
  }
};