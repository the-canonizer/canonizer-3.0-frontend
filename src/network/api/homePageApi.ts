import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import {
  setCanonizedNameSpaces,
  setCanonizedTopics,
  pushToCanonizedTopics,
} from "../../store/slices/homePageSlice";

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
    // message.error(error.message);
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
    // message.error(error.message);
  }
};

export const getRecentActivitiesApi = async (reqBody) => {
  try {
    /////////////////////////////////////////////////////////////////////////////
    // Once API gets completed I'll uncomment this chunk and remove mockData  //
    ///////////////////////////////////////////////////////////////////////////

    // const recentActivities = await NetworkCall.fetch(
    //   HomePageRequests.getCanonizedRecentActivities(reqBody),
    //   false
    // );
    const mockData = [
      {
        id: 27,
        log_name: "threads",
        description: "A thread has been updated",
        subject_type: "App\\Models\\Languages",
        subject_id: 20,
        causer_type: null,
        causer_id: null,
        properties: [],
        created_at: "2022-02-17T11:22:36.000000Z",
        updated_at: "2022-02-17T11:22:36.000000Z",
      },
    ];

    return mockData;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedAlgorithmsApi = async () => {
  try {
    const algorithms = await NetworkCall.fetch(
      HomePageRequests.getCanonizedAlgorithms()
    );
    store.dispatch(setCanonizedTopics(algorithms));
    return algorithms;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedWhatsNewContentApi = async () => {
  try {
    const whatsNew = await NetworkCall.fetch(
      HomePageRequests.getCanonizedWhatsNewContent()
    );
    return whatsNew?.data;
  } catch (error) {
    // message.error(error.message);
  }
};
