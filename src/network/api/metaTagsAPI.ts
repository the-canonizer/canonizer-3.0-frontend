import { store } from "src/store";
import { getCookies, isServer } from "src/utils/generalUtility";
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

export const getSitemapXML = async () => {
  const cc: any = getCookies();

  // let state = await store.getState();
  // const { auth } = state,
  //   tc = !isServer() && localStorage?.getItem("auth_token");

  let token = cc?.loginToken;

  // if (!token) {
  //   const response = await createToken();
  //   token = response?.access_token;
  // }

  try {
    const metaContent = await NetworkCall.fetch(
      MetaTagsRequest.getSitemapXMLContent(token)
    );
    return metaContent;
  } catch (error) {
    return error?.error?.data;
  }
};
