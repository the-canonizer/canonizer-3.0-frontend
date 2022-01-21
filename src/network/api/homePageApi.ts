import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import { setCanonizedTopics } from "../../store/slices/homePageSlice";

export const getCanonizedTopicsApi = async (reqBody) => {
  try {
    const topics = await NetworkCall.fetch(
      HomePageRequests.getCanonizedTopics(reqBody)
    );
    store.dispatch(setCanonizedTopics(topics));
    console.log("topics//////", topics);
    return topics;
  } catch (error) {
    message.error(error.message);
  }
};
