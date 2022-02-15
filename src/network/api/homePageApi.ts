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
    message.error(error.message);
  }
};

export const getRecentActivitiesApi = async () => {
  try {
    // const nameSpaces = await NetworkCall.fetch(
    //   HomePageRequests.getCanonizedRecentActivities()
    // );
    const mockData = [
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 1,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 2,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 3,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 4,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 5,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 6,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 7,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 8,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 9,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 10,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 11,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 12,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 13,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 14,
      },
      {
        link: "/",
        shortDescription: "More Intelligence Better",
        date: " Jun 23, 2012, 2:25:02 AM",
        id: 15,
      },
    ];
    return mockData;
    // return nameSpaces;
  } catch (error) {
    message.error(error.message);
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
    message.error(error.message);
  }
};

export const getCanonizedWhatsNewContentApi = async () => {
  try {
    const whatsNew = await NetworkCall.fetch(
      HomePageRequests.getCanonizedWhatsNewContent()
    );
    return whatsNew?.data;
  } catch (error) {
    message.error(error.message);
  }
};
