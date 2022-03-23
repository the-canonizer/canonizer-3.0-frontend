import NetworkCall from "../networkCall";
import TopicRequest from "../request/topicRequests";
import { handleError, isServer } from "../../utils/generalUtility";

export const createTopic = async (body) => {
  try {
    const res = await NetworkCall.fetch(TopicRequest.createTopic(body));
    return res;
  } catch (error) {
    handleError(error);
  }
};
