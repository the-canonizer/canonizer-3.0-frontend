import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import { setCanonizedTopics } from "../../store/slices/homePageSlice";

export const getCanonizedTopicsApi = async () => {
  const reqBody = {
    page_number: 1,
    page_size: 15,
    namespace_id: 1,
    asofdate: 1642464000,
    algorithm: "blind_popularity",
    search: "Hard",
  };
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
