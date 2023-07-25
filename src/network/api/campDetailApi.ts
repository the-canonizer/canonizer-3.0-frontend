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
  setRemovedReasons,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/campDetailRequest";
import { message } from "antd";
import { store } from "../../store";
import { handleError } from "../../utils/generalUtility";
import { createToken, SupportTreeAndScoreCount } from "./userApi";

export const getTreesApi = async (reqBody) => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees(reqBody), false);

    store.dispatch(setTree(trees?.data || []));
    return trees?.data[0];
  } catch (error) {
    store.dispatch(setTree([]));
    // message.error(error.message);
  }
};

export const getNewsFeedApi = async (reqBody, loginToken = null) => {
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getNewsFeed(reqBody, loginToken),
      false
    );
    store.dispatch(setNewsFeed(newsFeed?.data));
    return newsFeed?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedCampStatementApi = async (
  reqBody,
  loginToken = null
) => {
  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody, loginToken),
      false
    );
    store.dispatch(setCampStatement(campStatement?.data));
    return campStatement?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentTopicRecordApi = async (reqBody, loginToken = null) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentTopicRecord(reqBody, loginToken),
      false
    );

    store.dispatch(setCurrentTopicRecord(currentTopicRecord?.data));
    return currentTopicRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentCampRecordApi = async (reqBody, loginToken = null) => {
  try {
    const currentCampRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentCampRecord(reqBody, loginToken),
      false
    );

    store.dispatch(setCurrentCampRecord(currentCampRecord?.data));
    return currentCampRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const subscribeToCampApi = async (
  reqBody,
  isTopic: Boolean,
  loginToken = null
) => {
  try {
    const subscribeToCamp = await NetworkCall.fetch(
      TreeRequest.subscribeToCamp(reqBody, loginToken),
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
export const getCampBreadCrumbApi = async (reqBody, loginToken = null) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCampBreadCrumb(reqBody, loginToken),
      false
    );
    return currentTopicRecord;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getTopicActivityLogApi = async (reqBody, loginToken = null) => {
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getTopicActivityLog(reqBody, loginToken),
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

export const GetSupportedNickNames = async (id) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.NickNamesSupported(id));
    return res;
  } catch (err) {
    handleError(err);
  }
};

export const getAllRemovedReasons = async () => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.removedReasons());
    if (res.status_code === 200) {
      let rs = res?.data;
      rs = rs?.map((r: { reason: any }) => ({ ...r, label: r.reason }));
      store.dispatch(setRemovedReasons(rs));
    }
  } catch (err) {
    handleError(err);
  }
};

export const checkTopicCampExistAPICall = async (
  body: {
    topic_num: number;
    camp_num: number;
  },
  loginToken = null
) => {
  try {
    const res = await NetworkCall.fetch(
      TreeRequest.checkTopicCampExistRequest(body, loginToken)
    );
    return res;
  } catch (err) {
    handleError(err);
  }
};
