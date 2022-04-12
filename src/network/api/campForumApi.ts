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
