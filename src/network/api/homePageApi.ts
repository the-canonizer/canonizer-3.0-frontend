import NetworkCall from "../networkCall";
import { message } from "antd";
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

export const getCanonizedNameSpacesApi = async () => {
  try {
    const nameSpaces = await NetworkCall.fetch(
      HomePageRequests.getCanonizedNameSpaces()
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
    let state = store.getState();
    const { auth } = state;

    const recentActivities = await NetworkCall.fetch(
      HomePageRequests.getCanonizedRecentActivities(
        reqBody,
        auth?.loggedInUser?.token
      ),
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

export const getCanonizedAlgorithmsApi = async () => {
  try {
    const algorithms = await NetworkCall.fetch(
      HomePageRequests.getCanonizedAlgorithms(),
      false
    );
    store.dispatch(setCanonizedAlgorithms(algorithms));
    return algorithms;
  } catch (error) {
    store.dispatch(setCanonizedAlgorithms(null));
  }
};

export const getCanonizedWhatsNewContentApi = async () => {
  try {
    const whatsNew = await NetworkCall.fetch(
      HomePageRequests.getCanonizedWhatsNewContent()
    );
    store.dispatch(setWhatsNewContent(whatsNew?.data));
    return whatsNew?.data;
  } catch (error) {
    // message.error(error.message);
  }
};
