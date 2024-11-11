import NetworkCall from "../networkCall";
import NotificationRequests from "../request/notificationsRequests";
import { handleError } from "../../utils/generalUtility";

import { setData, setHeaderData } from "../../store/slices/notificationSlice";
import { store } from "src/store";
import md5 from "md5";
import axios from "axios";

export const getLists = async (
  page: number = 1,
  per_page: number = 5,
  is_seen: number = 0,
  loginToken = null
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(page, per_page, is_seen, loginToken),
      false
    );

    if (res && res?.status_code == 200) {
      const data = {
        count: res?.data?.unread_count,
        list: res?.data?.items,
      };
      store.dispatch(setHeaderData(data));
    }
    return res;
  } catch (error) {
    store.dispatch(setHeaderData({ count: 0, list: [] }));
    return error;
  }
};

export const getGravatarPicApi = async (email) => {
  try {
    let url = `https://www.gravatar.com/avatar/${md5(email)}?d=404`;
    let res = await axios.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getNotificationsList = async (
  page: number = 1,
  per_page: number = -1,
  is_seen: number = 0,
  loginToken = null
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(page, per_page, is_seen, loginToken),
      false
    );

    if (res && res?.status_code == 200) {
      store.dispatch(setData(res?.data?.items));
    }

    return res;
  } catch (error) {
    handleError(error);
    store.dispatch(setData([]));
    return error.error.data;
  }
};

export const markNotificationRead = async (id: number) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.markReadNotification(id),
      false
    );

    if (res && res?.status_code == 200) {
      await getNotificationsList(1, -1);
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const markAllNotificationRead = async (
  body: { ids: any[] },
  page = 1,
  perPage = -1
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.markAllReadNotification(body),
      false
    );

    if (res && res?.status_code == 200) {
      await getNotificationsList(1, -1);
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAllNotifications = async (
  body: { ids: any[] },
  page = 1,
  perPage = -1
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.deleteAllNotification(body),
      false
    );

    if (res && res?.status_code == 200) {
      await getNotificationsList(1, -1);
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const updateFCMToken = async (token: string) => {
  try {
    const body = { fcm_token: token };
    const res = await NetworkCall.fetch(
      NotificationRequests.updateNotificationToken(body),
      false
    );

    if (res && res?.status_code == 200) {
      await getNotificationsList(1, -1);
      await getLists();
    }

    return res;
  } catch (error) {
    //
  }
};
