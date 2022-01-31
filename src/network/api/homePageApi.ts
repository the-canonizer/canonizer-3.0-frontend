import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import {
  setCanonizedNameSpaces,
  setCanonizedTopics,
} from "../../store/slices/homePageSlice";

export const getCanonizedTopicsApi = async (reqBody, loadMore = false) => {
  try {
    const topics = await NetworkCall.fetch(
      HomePageRequests.getCanonizedTopics(reqBody)
    );

    store.dispatch(setCanonizedTopics(topics?.data));

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

    return nameSpaces;
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
