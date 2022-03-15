import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
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
    store.dispatch(setNewsFeed(newsFeed));
    return newsFeed;
  } catch (error) {
    message.error(error.message);
  }
};

export const getCanonizedCampStatementApi = async (reqBody) => {
  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody)
    );
    store.dispatch(setCampStatement(campStatement));
    return campStatement;
  } catch (error) {
    message.error(error.message);
  }
};

export const getCanonizedCampSupportingTreeApi = async (reqBody) => {
  try {
    const supportingTree = await NetworkCall.fetch(
      TreeRequest.getCampSupportingTree(reqBody)
    );
    store.dispatch(setCampSupportingTree(supportingTree));
    return supportingTree;
  } catch (error) {
    message.error(error.message);
  }
};
