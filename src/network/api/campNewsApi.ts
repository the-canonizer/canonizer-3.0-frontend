import NetworkCall from "../networkCall";
import { message } from "antd";
import campNewsRequest from "../request/addEditNewsRequests";

export const addNewsApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsRequest(body)
    );

    return editNewsData;
  } catch (error) {
    message.error(error.message);
    return error.error.data;
  }
};

export const getCampNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.getCampNewsData(body)
    );

    return editNewsData.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsData(body)
    );

    return editNewsData;
  } catch (error) {
    // message.error(error.message);

    return error.error.data;
  }
};
export const deleteNewsDataApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsData(body)
    );
    return editNewsData;
  } catch (error) {
    message.error(error.message);
    return error.error.data;
  }
};
