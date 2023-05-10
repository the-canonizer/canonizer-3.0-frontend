import NetworkCall from "../networkCall";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import {
  setCanonizedNameSpaces,
  setCanonizedTopics,
  pushToCanonizedTopics,
  setCanonizedAlgorithms,
  setWhatsNewContent,
} from "../../store/slices/homePageSlice";
import {
  setThreads,
  setTopics,
  pushToThreads,
  pushToTopics,
} from "../../store/slices/recentActivitiesSlice";
import { createToken } from "./userApi";

export const getCanonizedTopicsApi = async (reqBody, loadMore = false) => {
  try {
    const topics = await NetworkCall.fetch(
      HomePageRequests.getCanonizedTopics(reqBody),
      false
    );
    if (loadMore) {
      store.dispatch(pushToCanonizedTopics(topics?.data));
    } else {
      store.dispatch(setCanonizedTopics(topics?.data));
    }
    return topics?.data;
  } catch (error) {
    store.dispatch(setCanonizedTopics(null));
  }
};

export const getCanonizedNameSpacesApi = async (tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const nameSpaces = await NetworkCall.fetch(
      HomePageRequests.getCanonizedNameSpaces(token)
    );
    store.dispatch(setCanonizedNameSpaces(nameSpaces));
    return nameSpaces;
  } catch (error) {
    store.dispatch(setCanonizedNameSpaces(null));
  }
};

export const getRecentActivitiesApi = async (
  reqBody,
  loadMore = false,
  topicType
) => {
  try {
    let state = await store.getState();

    const { auth } = state,
      tc = localStorage?.getItem("auth_token");

    let token =
      auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

    if (!token) {
      const response = await createToken();
      token = response?.access_token;
    }

    const recentActivities = await NetworkCall.fetch(
      HomePageRequests.getCanonizedRecentActivities(reqBody, token),
      false
    );
    if (loadMore) {
      topicType == "topic/camps"
        ? store.dispatch(pushToTopics(recentActivities?.data))
        : store.dispatch(pushToThreads(recentActivities?.data));
    } else {
      topicType == "topic/camps"
        ? store.dispatch(setTopics(recentActivities?.data))
        : store.dispatch(setThreads(recentActivities?.data));
    }
  } catch (error) {
    store.dispatch(setThreads(null));
  }
};

export const getCanonizedAlgorithmsApi = async (tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const algorithms = await NetworkCall.fetch(
      HomePageRequests.getCanonizedAlgorithms(token),
      false
    );
    store.dispatch(setCanonizedAlgorithms(algorithms));
    return algorithms;
  } catch (error) {
    store.dispatch(setCanonizedAlgorithms(null));
  }
};

export const getCanonizedWhatsNewContentApi = async (tc = "") => {
  let token = tc;
  if (!tc) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const whatsNew = await NetworkCall.fetch(
      HomePageRequests.getCanonizedWhatsNewContent(token)
    );
    store.dispatch(setWhatsNewContent(whatsNew?.data));
    return whatsNew?.data;
  } catch (error) {
    // message.error(error.message);
  }
};
