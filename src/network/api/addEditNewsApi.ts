import NetworkCall from "../networkCall";
import { message } from "antd";
import addEditNewsRequest from "../request/addEditNewsRequests";

export const getAddNewsRequestApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      addEditNewsRequest.getAddNewsRequest(body)
    );

    return editNewsData;
  } catch (error) {
    message.error(error.message);
    return error.error.data;
  }
};

export const getCampNewsFeedApi = async (body) => {
  try {
    const  editNewsData = await NetworkCall.fetch(
      addEditNewsRequest.getCampNewsFeedData(body)
    );

    return editNewsData.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const getUpdateNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      addEditNewsRequest.getUpdateNewsFeedData(body)
    );

    return editNewsData;
  } catch (error) {
    // message.error(error.message);

    return error.error.data;
  }
};
export const getDeleteNewsFeedApi = async (body) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      addEditNewsRequest.getDeleteNewsFeedData(body)
    );
    return editNewsData;
  } catch (error) {
    message.error(error.message);
    return error.error.data;
  }
};
