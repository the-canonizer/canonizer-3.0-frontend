import K from "../../constants";
import Request from ".";

export default class addEditNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getAddNewsrequest(body) {
    return new Request(
      K.Network.URL.GetAddNewsFeeds,
      K.Network.Method.POST,
      {
        topic_num: body.topic_num,
        camp_num: body.camp_num,
        available_for_child: body.available_for_child,
        link: body.link,
        display_text: body.display_text,
      },
      K.Network.Header.Type.Json,
      {}
    );
  }

 

  static geteditNewsFeedData(body) {
    console.log("body in req ", body.topic_num, body.camp_num);
    return new Request(
      K.Network.URL.GetEditNewsFeeds,
      K.Network.Method.POST,
      {
        topic_num: body.topic_num,
        camp_num: body.camp_num,
      },
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getUpdateNewsFeedData(body) {
    return new Request(
      K.Network.URL.GetUpdateNewsFeeds,
      K.Network.Method.POST,
      {
        topic_num: body.topic_num,
        camp_num: body.camp_num,
        display_text: body.display_text,
        link: body.link,
        available_for_child: body.available_for_child,
      },
      K.Network.Header.Type.Json,
      {}
    );
  }
}
