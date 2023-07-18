import NetworkCall from "../networkCall";
import { message } from "antd";
import { campNewsRequest } from "../request/campNewsRequest";
import { store } from "../../store";
import { setCampNewsToEdit } from "../../../src/store/slices/news";
import { getCookies } from "src/utils/generalUtility";

export const addNewsFeedApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsFeed(body, cc?.loginToken)
    );
    return editNewsData;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const getEditCampNewsFeedApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getEditCampNewsFeed(body, cc?.loginToken)
    );
    let res = editNewsData?.data;
    store.dispatch(setCampNewsToEdit((res && res[0]) || {}));
    return res;
  } catch (error) {
    return error;
  }
};

export const updateNewsFeedApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsFeed(body, cc?.loginToken)
    );
    return editNewsData;
  } catch (error) {
    if (Object.keys(error?.error?.data?.error).includes("newsfeed_id")) {
      message.error("News does not found");
    }
    return error?.error?.data;
  }
};

export const deleteNewsFeedApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsFeed(body, cc?.loginToken)
    );
    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};
