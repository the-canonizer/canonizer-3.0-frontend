import K from "../../constants";
import Request from ".";

export default class NotificationRequest extends Request {
  constructor(params) {
    super(params);
  }

  static getNotification(page: number, per_page: number) {
    return new Request(
      `${K.Network.URL.GetList}?page=${page}&per_page=${per_page}`,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
