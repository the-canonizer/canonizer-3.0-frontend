import NetworkCall from "../networkCall";
import VideosContent from "../request/videosRequest";

export const getVideosContentApi = async (loginToken = null) => {
  try {
    const videosData = await NetworkCall.fetch(
      VideosContent.getVideosContent(loginToken),
      false
    );

    return videosData;
  } catch (error) {
    //
  }
};

export const getVideosApi = async (loginToken = null) => {
  try {
    const videosData = await NetworkCall.fetch(
      VideosContent.getVideos(loginToken),
      false
    );

    return videosData;
  } catch (error) {
    //
  }
};
