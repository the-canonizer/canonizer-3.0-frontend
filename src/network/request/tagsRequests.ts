import K from "../../constants";
import Request from ".";

export default class TagsRequests extends Request {
  constructor(params) {
    super(params);
  }

  static getTags(
    page: number,
    per_page: number,
    search_term: string,
    sort_by: string
  ) {
    const body = { page, per_page, search_term, sort_by };

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
