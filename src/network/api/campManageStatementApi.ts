import NetworkCall from "../networkCall";
import { message } from "antd";
import { campManageStatementRequest } from "../request/campManageStatementRequest";
import { store } from "../../store";
import { getCookies } from "src/utils/generalUtility";

export const getEditStatementApi = async (body) => {
  const cc: any = getCookies();

  // let state = store.getState();
  // const { auth } = state;

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditStatement(body, cc?.loginToken),
      false
    );
    return res;
  } catch (error) {
    return error?.error?.data;
  }
};
export const getEditCampApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditCamp(body, cc?.loginToken),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const getEditTopicApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditTopic(body, cc?.loginToken),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const getParseCampStatementApi = async (body) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getParseCampStatement(body)
    );
    return res;
  } catch (error) {
    return error;
  }
};
export const updateStatementApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateStatement(body, cc?.loginToken)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const updateCampApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateCamp(body, cc?.loginToken)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const updateTopicApi = async (body) => {
  // let state = store.getState();
  // const { auth } = state;

  const cc: any = getCookies();

  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateTopic(body, cc?.loginToken)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
