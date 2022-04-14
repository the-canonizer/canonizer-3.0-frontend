import NetworkCall from "../networkCall";
import TreadRequest from "../request/campForum";
import { handleError } from "../../utils/generalUtility";

export const createThread = async (body) => {
  try {
    const response = await NetworkCall.fetch(
      TreadRequest.createThread(body),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getThreadsList = async (queries) => {
  try {
    const response = await NetworkCall.fetch(
      TreadRequest.getThreads(queries),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const updateThread = async (body, id) => {
  try {
    const response = await NetworkCall.fetch(
      TreadRequest.updateThread(body, id),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};
