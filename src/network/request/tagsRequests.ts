import K from "../../constants";
import Request from ".";

export default class TagsRequests extends Request {
  constructor(params) {
    super(params);
  }

  static getTags(body) {
    return new Request(
      K.Network.URL.GetTagsList,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.formData,
      {}
    );
  }

  static saveCatsPref(user_tags: any[]) {
    const body = { user_tags };

    return new Request(
      K.Network.URL.SavePrefCats,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.formData,
      {}
    );
  }
}
