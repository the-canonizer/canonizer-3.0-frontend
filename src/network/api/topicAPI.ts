import NetworkCall from "../networkCall";
import TopicRequest from "../request/topicRequests";
import { store } from "src/store";
import { handleError, getCookies } from "src/utils/generalUtility";
import { createToken } from "./userApi";

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
  // let state = await store.getState();

  const cc: any = getCookies();

  const tc = cc?.loginToken;

  let token = tc;

  // if (!token) {
  //   const response = await createToken();
  //   token = response?.access_token;
  // }

  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetActiveSupportTopic(body, token)
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

export const GetCheckSupportExists = async (reqbody) => {
  // let state = await store.getState();

  const cc: any = getCookies();

  // const { auth } = state;

  let token = cc?.loginToken;

  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetCheckSupportExists(reqbody, token)
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
