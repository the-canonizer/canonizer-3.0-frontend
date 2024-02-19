import NetworkCall from "../networkCall";
import { message } from "antd";
import { campManageStatementRequest } from "../request/campManageStatementRequest";
import { store } from "../../store";
export const getEditStatementApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditStatement(body, loginToken),
      false
    );
    return res;
  } catch (error) {
    message?.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const getEditCampApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditCamp(body, loginToken),
      false
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const getEditTopicApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.getEditTopic(body, loginToken),
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
export const updateStatementApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateStatement(body, loginToken)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
export const updateCampApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateCamp(body, loginToken)
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const updateTopicApi = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      campManageStatementRequest.updateTopic(body, loginToken)
    );
    return res;
  } catch (error) {
    // message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};
