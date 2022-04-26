import NetworkCall from "../networkCall";
import { message } from "antd";
import { campNewsRequest } from "../request/campNewsRequest";
import { store } from "../../store";
import { setCampNewsToEdit } from "../../../src/store/slices/news";

export const addNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsFeed(body)
    );
    return editNewsData;
  } catch (error) {
    message.error(error?.message);
    return error?.error?.data;
  }
};

export const getEditCampNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getEditCampNewsFeed(body)
    );
    let res = editNewsData?.data;
    store.dispatch(setCampNewsToEdit((res && res[0]) || {}));
    return res;
  } catch (error) {
    return error;
  }
};

export const updateNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsFeed(body)
    );
    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};

export const deleteNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsFeed(body)
    );
    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};
