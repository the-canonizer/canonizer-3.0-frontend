import K from "../../constants";
import Request from ".";

export default class NotificationRequest extends Request {
  constructor(params) {
    super(params);
  }

  static getNotification(
    page: number,
    per_page: number,
    is_seen: number,
    token
  ) {
    return new Request(
      `${K.Network.URL.GetList}?page=${page}&per_page=${per_page}&is_seen=${is_seen}`,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static markReadNotification(id) {
    return new Request(
      `${K.Network.URL.MarkRead}${id}`,
      K.Network.Method.PUT,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static updateNotificationToken(body) {
    return new Request(
      K.Network.URL.UpdateToken,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
