import NetworkCall from "../networkCall";
import { message } from "antd";
import { campNewsRequest } from "../request/campNewsRequest";
import { store } from "../../store";
import { setCampNewsToEdit } from "../../../src/store/slices/news";

export const addNewsDatapi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsDataRequest(body)
    );

    return editNewsData;
  } catch (error) {
    message.error(error?.message);
    return error?.error?.data;
  }
};

export const getCampNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getCampNewsData(body)
    );

    return editNewsData?.data;
  } catch (error) {
    message.error(error?.message);
  }
};
export const getCampEditNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getCampEditNewsData(body)
    );
    let res = editNewsData?.data;
    store.dispatch(setCampNewsToEdit((res && res[0]) || {}));
    return res;
  } catch (error) {
    return error;
  }
};

export const updateNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsData(body)
    );

    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};

export const deleteNewsApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsData(body)
    );
    return editNewsData;
  } catch (error) {
    return error?.error?.data;
  }
};
