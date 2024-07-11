import NetworkCall from "../networkCall";
import ForumRequests from "../request/campForumRequests";
import { handleError } from "../../utils/generalUtility";

export const createThread = async (body) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.createThread(body),
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
      ForumRequests.updateThread(body, id),
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
      ForumRequests.getThreads(queries),
      false
    );

    return response;
  } catch (error) {
    // handleError(error);

    return error?.error?.data;
  }
};

export const createPost = async (body) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.createPost(body),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const latestThread = async (queries) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.latestThread(queries),
      false
    );

    return response;
  } catch (error) {
    // handleError(error);

    return error?.error?.data;
  }
};

export const getSiblingCamp = async (queries) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.siblingCamps(queries),
      false
    );

    return response;
  } catch (error) {
    // handleError(error);

    return error?.error?.data;
  }
};

export const updatePost = async (body, id) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.updatePost(body, id),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getPostsList = async (thread_id, queries, token = "") => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.getPosts(thread_id, queries, token),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const deletePost = async (id) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.deletePost(id),
      false
    );

    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getThreadData = async (
  thread_id: string,
  topic_num: string,
  camp_num: string,
  token: string = ""
) => {
  try {
    const response = await NetworkCall.fetch(
      ForumRequests.getThreadDetails(thread_id, topic_num, camp_num, token),
      false
    );

    return response;
  } catch (error) {
    return error.error;
  }
};
