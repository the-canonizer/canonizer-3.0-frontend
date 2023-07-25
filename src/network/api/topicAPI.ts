import NetworkCall from "../networkCall";
import TopicRequest from "../request/topicRequests";
import { handleError } from "src/utils/generalUtility";

export const createTopic = async (body) => {
  try {
    const res = await NetworkCall.fetch(TopicRequest.createTopic(body));
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};

export const GetActiveSupportTopic = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetActiveSupportTopic(body, loginToken)
    );

    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err.error?.data;
    }
  }
};

export const GetCheckSupportExists = async (reqbody, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetCheckSupportExists(reqbody, loginToken)
    );
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};
