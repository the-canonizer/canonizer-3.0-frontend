import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import {
  setCanonizedNameSpaces,
  setCanonizedTopics,
  pushToCanonizedTopics,
  setCanonizedAlgorithms,
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

export const getRecentActivitiesApi = async (
  reqBody,
  loadMore = false,
  topicType
) => {
  try {
    /////////////////////////////////////////////////////////////////////////////
    // Once API gets completed I'll uncomment this chunk and remove mockData  //
    ///////////////////////////////////////////////////////////////////////////

    // const recentActivities = await NetworkCall.fetch(
    //   HomePageRequests.getCanonizedRecentActivities(reqBody),
    //   false
    // );
    let state = store.getState();
    const { auth } = state;

    const recentActivities = await NetworkCall.fetch(
      HomePageRequests.getCanonizedRecentActivities(
        reqBody,
        auth?.loggedInUser?.token
      )
    );

    const mockDataThread = {
      numOfPages: 6,
      topics: [
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
      ],
    };

    if (loadMore) {
      topicType == "topic/camps"
        ? store.dispatch(pushToTopics(recentActivities?.data))
        : store.dispatch(pushToThreads(mockDataThread));
    } else {
      topicType == "topic/camps"
        ? store.dispatch(setTopics(recentActivities?.data))
        : store.dispatch(setThreads(mockDataThread));
    }
    return mockDataThread;
  } catch (error) {
    // message.error(error.message);
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
