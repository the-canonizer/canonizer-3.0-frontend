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
  type = "all",
  loginToken = null
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(
        page,
        per_page,
        is_seen,
        type,
        loginToken
      ),
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
const BaseCanonizerApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  try {
    const postData = {
      email: email,
    };
    const url = `${BaseCanonizerApiUrl}/gravatar`;
    let res = await axios.post(url, postData); 
    return res;
  } catch (error) {
    return error; // Return the error
  }
};

export const getNotificationsList = async (
  page: number = 1,
  per_page: number = 10,
  is_seen: number = 0,
  type = "all",
  loadMore = false,
  loginToken = null
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(
        page,
        per_page,
        is_seen,
        type,
        loginToken
      ),
      false
    );

    if (res && res?.status_code == 200) {
      if (loadMore) {
        const oldData = await store.getState().notifications.data;
        store.dispatch(setData([...oldData, ...res?.data?.items]));
      } else {
        store.dispatch(setData(res?.data?.items));
      }
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
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const markAllNotificationRead = async (body: { ids: any[] }) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.markAllReadNotification(body),
      false
    );

    if (res && res?.status_code == 200) {
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAllNotifications = async (body: { ids: any[] }) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.deleteAllNotification(body),
      false
    );

    if (res && res?.status_code == 200) {
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
