import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/campDetailRequest";
import { message } from "antd";
import { store } from "../../store";

export const getTreesApi = async (reqBody) => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees(reqBody));
    store.dispatch(setTree(trees?.data[0]));
    return trees?.data[0];
  } catch (error) {
    message.error(error.message);
  }
};

export const getNewsFeedApi = async (reqBody) => {
  try {
    const newsFeed = await NetworkCall.fetch(TreeRequest.getNewsFeed(reqBody));
    store.dispatch(setNewsFeed(newsFeed?.data));
    return newsFeed?.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const getCanonizedCampStatementApi = async (reqBody) => {
  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody)
    );
    store.dispatch(setCampStatement(campStatement?.data));
    return campStatement?.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const getCanonizedCampSupportingTreeApi = async (
  reqBody,
  loadMore = false
) => {
  try {
    // const supportingTree = await NetworkCall.fetch(
    //   TreeRequest.getCampSupportingTree(reqBody)
    // );
    const mockSupporters = [
      {
        id: 1,
        name: "1:shahab",
        score: 1,
      },
      {
        id: 1,
        name: "Awais",
        score: 234,
      },
      {
        id: 1,
        name: "Umair",
        score: 234,
      },
      {
        id: 1,
        name: "Shawaiz",
        score: 234,
      },
      {
        id: 1,
        name: "Ahmed",
        score: 234,
      },
      {
        id: 1,
        name: "Darab",
        score: 234,
      },
      {
        id: 1,
        name: "wahaj",
        score: 234,
      },
      {
        id: 1,
        name: "shahzaib",
        score: 234,
      },
      {
        id: 1,
        name: "Talha",
        score: 234,
      },
      {
        id: 1,
        name: "Saim",
        score: 234,
      },
    ];
    if (loadMore) {
      store.dispatch(pushToCampSupportingTree(mockSupporters));
    } else {
      store.dispatch(setCampSupportingTree(mockSupporters));
    }
    return mockSupporters;
  } catch (error) {
    message.error(error.message);
  }
};
