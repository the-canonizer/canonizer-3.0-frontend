import NetworkCall from "../networkCall";
import { message } from "antd";
import { campManageStatementRequest } from "../request/campManageStatementRequest";
import { store } from "../../store";

export const getEditStatementApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditStatement(
        body,
        auth?.loggedInUser?.token
      ),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const getEditCampApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditCamp(body, auth?.loggedInUser?.token),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const getEditTopicApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditTopic(body, auth?.loggedInUser?.token),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const updateStatementApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateStatement(
        body,
        auth?.loggedInUser?.token
      )
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const updateCampApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateCamp(body, auth?.loggedInUser?.token)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const updateTopicApi = async (body) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateTopic(body, auth?.loggedInUser?.token)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
