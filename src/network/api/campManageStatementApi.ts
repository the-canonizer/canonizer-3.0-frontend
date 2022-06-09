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
      )
    );
    return res;
  } catch (error) {
    message.error(error?.error?.data?.message);
    return error?.error?.data;
  }
};

export const updateStatementApi = async (body) => {
  console.log("reqbody1 =>", body);
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
    Object.entries(error?.error?.data?.error).forEach((msg) => {
      message?.error(msg[1][0]);
    });
    return error?.error?.data;
  }
};
