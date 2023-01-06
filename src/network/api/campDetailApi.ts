import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/campDetailRequest";
import { message } from "antd";
import { store } from "../../store";
import { handleError } from "../../utils/generalUtility";
import { SupportTreeAndScoreCount } from "./userApi";

export const getTreesApi = async (reqBody) => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees(reqBody), false);

    store.dispatch(setTree(trees?.data || []));
    return trees?.data[0];
  } catch (error) {
    // message.error(error.message);
  }
};

export const getNewsFeedApi = async (reqBody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getNewsFeed(reqBody, auth?.loggedInUser?.token),
      false
    );
    store.dispatch(setNewsFeed(newsFeed?.data));
    return newsFeed?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedCampStatementApi = async (reqBody) => {
  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody),
      false
    );
    store.dispatch(setCampStatement(campStatement?.data));
    return campStatement?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentTopicRecordApi = async (reqBody) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentTopicRecord(reqBody),
      false
    );
    store.dispatch(setCurrentTopicRecord(currentTopicRecord?.data));
    return currentTopicRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentCampRecordApi = async (reqBody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const currentCampRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentCampRecord(reqBody, auth.loggedInUser?.token),
      false
    );

    store.dispatch(setCurrentCampRecord(currentCampRecord?.data));
    return currentCampRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const subscribeToCampApi = async (reqBody, isTopic: Boolean) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const subscribeToCamp = await NetworkCall.fetch(
      TreeRequest.subscribeToCamp(reqBody, auth.loggedInUser?.token),
      false
    );
    isTopic
      ? store.dispatch(
          setCurrentTopicRecordSubscriptionId(
            subscribeToCamp?.data?.subscriptionId || null
          )
        )
      : store.dispatch(
          setCurrentCampRecordSubscriptionId(
            subscribeToCamp?.data?.subscriptionId || null
          )
        );
    subscribeToCamp?.data?.msg
      ? message.info(subscribeToCamp?.data?.msg)
      : message.info(subscribeToCamp?.message);
    return subscribeToCamp;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedCampSupportingTreeApi = async (
  reqBody,
  algorithm,
  loadMore = false
) => {
  try {
    // const supportingTree = await NetworkCall.fetch(
    //   TreeRequest.getCampSupportingTree(reqBody), false
    // );

    const supportTreeCard = await SupportTreeAndScoreCount({
      algorithm: algorithm,
      topic_num: reqBody.topic_num,
      camp_num: reqBody.camp_num,
    });

    if (loadMore) {
      store.dispatch(pushToCampSupportingTree(supportTreeCard.data));
    } else {
      store.dispatch(setCampSupportingTree(supportTreeCard.data));
    }
    return supportTreeCard.data;
  } catch (error) {
    message.error(error.message);
  }
};

export const createCamp = async (body) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.createCamp(body));
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.camp_name &&
      !err.error.data.error?.camp_about_url
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};

export const getAllParentsCamp = async (body) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.getAllParentsCamp(body));
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const getAllCampNickNames = async () => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.getAllCampNickNames());
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsedNickNames = async (body) => {
  try {
    const res = await NetworkCall.fetch(
      TreeRequest.getUsedNickNames(body),
      false
    );
    return res;
  } catch (error) {
    handleError(error);
    return error.error;
  }
};
export const getCampBreadCrumbApi = async (reqBody) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCampBreadCrumb(reqBody),
      false
    );
    return currentTopicRecord;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getTopicActivityLogApi = async (reqBody) => {
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getTopicActivityLog(reqBody),
      false
    );
    return newsFeed;
  } catch (error) {
    message.error(error.message);
  }
};

export const SupportTreeTotalScore = async (reqbody) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.TotalScore(reqbody));
    return res;
  } catch (err) {
    handleError(err);
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400
    ) {
      return err.error.data;
    }
  }
};
