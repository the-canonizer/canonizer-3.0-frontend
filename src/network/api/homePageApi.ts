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

export const getCanonizedTopicsApi = async (reqBody, loadMore = false) => {
  try {
    const topics = await NetworkCall.fetch(
      HomePageRequests.getCanonizedTopics(reqBody),
      false
    );

    store.dispatch(setCanonizedTopics(topics?.data));

    return topics?.data;
  } catch (error) {
    store.dispatch(setCanonizedTopics(null));
  }
};

// Namespaces were removed in the categories cutover. This shim keeps the
// many call sites compiling and running but never hits the network.
// Remove call sites and this function entirely in a follow-up cleanup.
export const getCanonizedNameSpacesApi = async (_tc = "") => {
  store.dispatch(setCanonizedNameSpaces({ data: [] }));
  return { data: [] };
};

export const getRecentActivitiesApi = async (
  reqBody,
  loadMore = false,
  topicType,
  loginToken = null
) => {
  try {
    const recentActivities = await NetworkCall.fetch(
      HomePageRequests.getCanonizedRecentActivities(reqBody, loginToken),
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

export const getCanonizedAlgorithmsApi = async (loginToken = null) => {
  try {
    const algorithms = await NetworkCall.fetch(
      HomePageRequests.getCanonizedAlgorithms(loginToken),
      false
    );
    store.dispatch(setCanonizedAlgorithms(algorithms));
    return algorithms;
  } catch (error) {
    store.dispatch(setCanonizedAlgorithms(null));
  }
};

export const getCanonizedWhatsNewContentApi = async (tc = "") => {
  try {
    const whatsNew = await NetworkCall.fetch(
      HomePageRequests.getCanonizedWhatsNewContent(tc)
    );
    store.dispatch(setWhatsNewContent(whatsNew?.data));
    return whatsNew?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedTopicsForSuggestion = async (reqBody: any) => {
  try {
    const topics = await NetworkCall.fetch(
      HomePageRequests.getCanonizedTopics(reqBody)
    );

    return topics?.data;
  } catch (error) {
    // hanlde error here
  }
};
