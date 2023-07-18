import { store } from "src/store";
import NetworkCall from "../networkCall";
import VideosContent from "../request/videosRequest";
import { createToken } from "./userApi";
import { getCookies } from "src/utils/generalUtility";

export const getVideosContentApi = async () => {
  // const { auth } = await store.getState();
  // let token = auth?.token || auth?.authToken;

  const cc: any = getCookies();

  // if (!token) {
  //   const response = await createToken();
  //   token = response?.access_token;
  // }

  let token = cc?.loginToken;

  try {
    const videosData = await NetworkCall.fetch(
      VideosContent.getVideosContent(token),
      false
    );

    return videosData;
  } catch (error) {}
};
