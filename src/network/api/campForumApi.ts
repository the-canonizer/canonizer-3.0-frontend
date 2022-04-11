import NetworkCall from "../networkCall";
import TreadRequest from "../request/campForum";
import { handleError } from "../../utils/generalUtility";

export const createThread = async (reqBody) => {
  try {
    const response = await NetworkCall.fetch(
      TreadRequest.createThread(reqBody),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};
