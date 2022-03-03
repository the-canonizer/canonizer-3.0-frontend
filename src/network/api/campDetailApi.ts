import { setTree, setNewsFeed } from "../../store/slices/campDetailSlice";
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
    store.dispatch(setNewsFeed(newsFeed));
    return newsFeed;
  } catch (error) {
    message.error(error.message);
  }
};
