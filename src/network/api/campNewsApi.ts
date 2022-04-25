import NetworkCall from "../networkCall";
import { message } from "antd";
import campNewsRequest from "../request/campNewsRequest";

export const addNewsDatapi = async (body,tokenBearer) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.addNewsDataRequest(body,tokenBearer)
    );

    return editNewsData;
  } catch (error) {
    message.error(error.message);
    return error.error.data;
  }
};

export const getCampNewsDataApi = async (body) => {
  try {
    const  editNewsData = await NetworkCall.fetch(
      campNewsRequest.getCampNewsData(body)
    );

    return editNewsData.data;
  } catch (error) {
    message.error(error.message);
  }
};
export const getCampEditNewsDataApi = async (body,tokenBearer) => {
  
  try {
    const  editNewsData = await NetworkCall.fetch(
      campNewsRequest.getCampEditNewsData(body,tokenBearer)
    );

    return editNewsData.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const updateNewsDataApi = async (body,tokenBearer) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.updateNewsData(body,tokenBearer)
    );

    return editNewsData;
  } catch (error) {
    // message.error(error.message);

    return error.error.data;
  }
};
export const deleteNewsApi = async (body,tokenBearer) => {
  try {
    const editNewsData = await NetworkCall.fetch(
      campNewsRequest.deleteNewsData(body,tokenBearer)
    );
    return editNewsData;
  } catch (error) {
    return error.error.data;
  }
};
