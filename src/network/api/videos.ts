import NetworkCall from "../networkCall";
import VideosContent from "../request/videosRequest";

export const getVideosContentApi = async () => {
  try {
    const videosData = await NetworkCall.fetch(
      VideosContent.getVideosContent(),
      false
    );

    return videosData;
  } catch (error) {
    // message.error(error.message);
  }
};
