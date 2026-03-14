import NetworkCall from "../networkCall";
import { campNewsRequest } from "../request/campNewsRequest";
import { store } from "../../store";
import { setCampNewsToEdit } from "../../../src/store/slices/news";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

export const addNewsFeedApi = async (body, loginToken = null) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsFeed(body, loginToken)
    );
    return editNewsData;
  } catch (error) {
    openNotificationWithIcon(error?.error?.data?.message, "error");
    return error?.error?.data;
  }
};

export const getEditCampNewsFeedApi = async (body, loginToken = null) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getEditCampNewsFeed(body, loginToken)
    );
    let res = editNewsData?.data;
    store.dispatch(setCampNewsToEdit((res && res[0]) || {}));
    return res;
  } catch (error) {
    return error;
  }
};

export const updateNewsFeedApi = async (body, loginToken = null) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsFeed(body, loginToken)
    );
    return editNewsData;
  } catch (error) {
    if (Object.keys(error?.error?.data?.error).includes("newsfeed_id")) {
      openNotificationWithIcon("News does not found", "error");
    }
    return error?.error?.data;
  }
};

export const deleteNewsFeedApi = async (body, loginToken = null) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsFeed(body, loginToken)
    );
    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};
