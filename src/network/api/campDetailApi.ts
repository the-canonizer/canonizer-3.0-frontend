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
import { handleError, isServer } from "../../utils/generalUtility";
import { createToken, SupportTreeAndScoreCount } from "./userApi";

export const getTreesApi = async (reqBody) => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees(reqBody), false);

    store.dispatch(setTree(trees?.data || []));
    return {treeData:trees?.data[0],status_code:trees?.code,message:trees?.message };
  } catch (error) {
    store.dispatch(setTree([]));
    let data = error?.error?.data
    return {treeData:data?.data[0],status_code:data?.code,message:data?.message };

  }
};

export const getNewsFeedApi = async (reqBody, loginToken = null) => {
  let token;

  if (isServer()) {
    if (loginToken) {
      token = loginToken;
    } else {
      const response = await createToken();
      token = response?.access_token;
    }
  } else {
    let state = await store.getState();
    const { auth } = state,
      tc = localStorage?.getItem("auth_token");
    token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;
    if (!token) {
      const response = await createToken();
      token = response?.access_token;
    }
  }

  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getNewsFeed(reqBody, token),
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
  let token;

  if (isServer()) {
    if (loginToken) {
      token = loginToken;
    } else {
      const response = await createToken();
      token = response?.access_token;
    }
  } else {
    let state = await store.getState();
    const { auth } = state,
      tc = localStorage?.getItem("auth_token");

    let token =
      auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

    if (!token) {
      const response = await createToken();
      token = response?.access_token;
    }
  }

  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody, token),
      false
    );
    store.dispatch(setCampStatement(campStatement?.data));
    return campStatement?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentTopicRecordApi = async (reqBody, loginToken = null) => {
  let token;
  if (isServer()) {
    if (loginToken) {
      token = loginToken;
    } else {
      const response = await createToken();
      token = response?.access_token;
    }
  } else {
    let state = await store.getState();
    const { auth } = state,
      tc = localStorage?.getItem("auth_token");

    let token =
      auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

    if (!token) {
      const response = await createToken();
      token = response?.access_token;
    }
  }
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentTopicRecord(reqBody, token),
      false
    );

    store.dispatch(setCurrentTopicRecord(currentTopicRecord?.data));
    return currentTopicRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentCampRecordApi = async (reqBody, loginToken = null) => {
  let token;
  if (isServer()) {
    if (loginToken) {
      token = loginToken;
    } else {
      const response = await createToken();
      token = response?.access_token;
    }
  } else {
    let state = await store.getState();
    const { auth } = state,
      tc = localStorage?.getItem("auth_token");

    token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

    if (!token) {
      const response = await createToken();
      token = response?.access_token;
    }
  }

  try {
    const currentCampRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentCampRecord(reqBody, token),
      false
    );

    store.dispatch(setCurrentCampRecord(currentCampRecord?.data));
    return {campData: currentCampRecord?.data,status_code:currentCampRecord?.status_code}
  } catch (error) {
    return {status_code:error?.error?.data?.status_code}
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
  let state = await store.getState();

  const { auth } = state,
    tc = localStorage?.getItem("auth_token");

  let token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

  if (!token) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCampBreadCrumb(reqBody, token),
      false
    );
    return currentTopicRecord;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getTopicActivityLogApi = async (reqBody) => {
  let state = await store.getState();

  const { auth } = state,
    tc = localStorage?.getItem("auth_token");

  let token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

  if (!token) {
    const response = await createToken();
    token = response?.access_token;
  }
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getTopicActivityLog(reqBody, token),
      false
    );
    return newsFeed;
  } catch (error) {
    message.error(error.message);
    return error;
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

export const checkTopicCampExistAPICall = async (body: {
  topic_num: number;
  camp_num: number;
}) => {
  let state = await store.getState();

  const { auth } = state,
    tc = !isServer() && localStorage?.getItem("auth_token");

  let token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

  if (!token) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const res = await NetworkCall.fetch(
      TreeRequest.checkTopicCampExistRequest(body, token)
    );
    return res;
  } catch (err) {
    handleError(err);
  }
};
