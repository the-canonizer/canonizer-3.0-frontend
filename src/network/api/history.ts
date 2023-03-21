import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import {
  pushToCampHistory,
  setHistory,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import historyRequest from "../request/historyRequest";
import { createToken } from "./userApi";

export const getHistoryApi = async (reqBody, pageNumber, historyOf: string) => {
  let state = await store.getState();

  const { auth } = state,
    tc = localStorage?.getItem("auth_token");

  let token = auth?.loggedInUser?.token || auth?.authToken || auth?.token || tc;

  if (!token) {
    const response = await createToken();
    token = response?.access_token;
  }

  try {
    const history = await NetworkCall.fetch(
      historyRequest.getHistory(reqBody, token, historyOf),
      false
    );
    if (pageNumber == 1) {
      store.dispatch(setHistory(history.data));
    } else {
      store.dispatch(pushToCampHistory(history.data.items || []));
    }
    return history?.data;
  } catch (error) {
    store.dispatch(pushToCampHistory([]));
  }
};

export const getCompareStatement = async (reqBody) => {
  try {
    const res = await NetworkCall.fetch(
      historyRequest.statementCompare(reqBody),
      false
    );

    return res;
  } catch (error) {
    handleError(error);
  }
};

export const changeCommitStatement = async (reqBody) => {
  try {
    const res = await NetworkCall.fetch(
      historyRequest.commitChangeStatement(reqBody),
      false
    );

    return res;
  } catch (error) {
    handleError(error);
    return error;
  }
};
export const agreeToChangeApi = async (reqBody) => {
  try {
    const res = await NetworkCall.fetch(
      historyRequest.agreeToChange(reqBody),
      false
    );

    return res;
  } catch (error) {
    handleError(error);
    return error;
  }
};
