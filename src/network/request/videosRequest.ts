import K from "../../constants";
import Request from ".";

export default class VideosContent extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getVideosContent(token) {
    return new Request(
      K.Network.URL.VideosContent,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getVideos(token) {
    return new Request(
      K.Network.URL.Videos,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}