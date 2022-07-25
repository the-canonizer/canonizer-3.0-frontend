import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import {
  pushToCampHistory,
  setHistory,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import historyRequest from "../request/historyRequest";

export const getHistoryApi = async (reqBody, pageNumber, historyOf: string) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const history = await NetworkCall.fetch(
      historyRequest.getHistory(reqBody, auth.loggedInUser?.token, historyOf),
      false
    );
    if (pageNumber == 1) {
      store.dispatch(setHistory(history.data));
    } else {
      store.dispatch(pushToCampHistory(history.data.items || []));
    }
    // debugger;
    return history?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getLiveHistoryApi = async (reqBody, historyOf) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const history = await NetworkCall.fetch(
      historyRequest.getLiveHistory(reqBody, historyOf),
      false
    );

    store.dispatch(setHistory({ items: history.data }));
    return history.data;
  } catch (error) {
    return error;
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
