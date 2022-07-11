import NetworkCall from "../networkCall";
import TopicRequest from "../request/topicRequests";
import { handleError, isServer } from "../../utils/generalUtility";
import { store } from "src/store";

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

export const GetActiveSupportTopic = async (body) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetActiveSupportTopic(body)
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
      return err.error.data;
    }
  }
};

export const GetCheckSupportExists = async (reqbody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetCheckSupportExists(reqbody, auth.loggedInUser?.token)
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
      return err.error.data;
    }
  }
};
