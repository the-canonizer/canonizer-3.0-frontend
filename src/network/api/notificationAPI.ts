import NetworkCall from "../networkCall";
import NotificationRequests from "../request/notificationsRequests";
import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import { setData, setHeaderData } from "../../store/slices/notificationSlice";

export const getLists = async (page: number = 1, per_page: number = 5) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(page, per_page),
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
    handleError(error);
  }
};

export const getNotificationsList = async (
  page: number = 1,
  per_page: number = 50
) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.getNotification(page, per_page),
      false
    );

    if (res && res?.status_code == 200) {
      store.dispatch(setData(res?.data?.items));
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const markNotificationRead = async (id: number) => {
  try {
    const res = await NetworkCall.fetch(
      NotificationRequests.markReadNotification(id),
      false
    );

    if (res && res?.status_code == 200) {
      await getNotificationsList();
      await getLists();
    }

    return res;
  } catch (error) {
    handleError(error);
  }
};
