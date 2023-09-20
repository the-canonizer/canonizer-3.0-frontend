import { store } from "src/store";
import NetworkCall from "../networkCall";
import VideosContent from "../request/videosRequest";
import { createToken } from "./userApi";

export const getVideosContentApi = async () => {
  const { auth } = await store.getState();
  let token = auth?.token || auth?.authToken;
  if (!token) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const videosData = await NetworkCall.fetch(
      VideosContent.getVideosContent(token),
      false
    );

    return videosData;
  } catch (error) {
    //
  }
};
