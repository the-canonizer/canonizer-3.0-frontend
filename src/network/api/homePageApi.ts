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

    store.dispatch(setCanonizedTopics(topics));

    return topics;
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
    // const mockResponse = {
    //   status_code: 200,
    //   message: "Success",
    //   error: null,
    //   data: [
    //     {
    //       id: 1,
    //       parent_id: 0,
    //       name: "Genaral",
    //       label: "Genaral",
    //     },
    //     {
    //       id: 2,
    //       parent_id: 0,
    //       name: "corporations",
    //       label: "/corporations/",
    //     },
    //     {
    //       id: 3,
    //       parent_id: 0,
    //       name: "crypto_currency",
    //       label: "/crypto_currency/",
    //     },
    //     {
    //       id: 4,
    //       parent_id: 0,
    //       name: "family",
    //       label: "/family/",
    //     },
    //     {
    //       id: 5,
    //       parent_id: 3,
    //       name: "Jesperson_Oscar_F",
    //       label: "/family/Jesperson_Oscar_F/",
    //     },
    //     {
    //       id: 6,
    //       parent_id: 0,
    //       name: "Occupy Wall Street",
    //       label: "/Occupy Wall Street/",
    //     },
    //     {
    //       id: 7,
    //       parent_id: 0,
    //       name: "organizations",
    //       label: "/organizations/",
    //     },
    //     {
    //       id: 8,
    //       parent_id: 6,
    //       name: "canonizer",
    //       label: "/organizations/canonizer/",
    //     },
    //     {
    //       id: 9,
    //       parent_id: 7,
    //       name: "help",
    //       label: "/organizations/canonizer/help/",
    //     },
    //     {
    //       id: 10,
    //       parent_id: 6,
    //       name: "mta",
    //       label: "/organizations/mta/",
    //     },
    //     {
    //       id: 11,
    //       parent_id: 6,
    //       name: "TV07",
    //       label: "/organizations/TV07/",
    //     },
    //     {
    //       id: 12,
    //       parent_id: 6,
    //       name: "wta",
    //       label: "/organizations/wta/",
    //     },
    //     {
    //       id: 13,
    //       parent_id: 0,
    //       name: "personal_attributes",
    //       label: "/personal_attributes/",
    //     },
    //     {
    //       id: 14,
    //       parent_id: 0,
    //       name: "personal_reputations",
    //       label: "/personal_reputations/",
    //     },
    //     {
    //       id: 15,
    //       parent_id: 0,
    //       name: "professional_services",
    //       label: "/professional_services/",
    //     },
    //     {
    //       id: 16,
    //       parent_id: 0,
    //       name: "sandbox",
    //       label: "/sandbox/",
    //     },
    //     {
    //       id: 17,
    //       parent_id: 0,
    //       name: "terminology",
    //       label: "/terminology/",
    //     },
    //     {
    //       id: 18,
    //       parent_id: 0,
    //       name: "www",
    //       label: "/www/",
    //     },
    //   ],
    // };
    // return mockResponse;
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
