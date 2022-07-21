import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import {
  pushToCampStatementHistory,
  setHistory,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import CampStatementHistoryRequest from "../request/campStatementHistoryRequest";

export const getHistoryApi = async (reqBody, pageNumber, historyOf: string) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const campStatementHistory = await NetworkCall.fetch(
      CampStatementHistoryRequest.getHistory(
        reqBody,
        auth.loggedInUser?.token,
        historyOf
      ),
      false
    );
    if (pageNumber == 1) {
      store.dispatch(setHistory(campStatementHistory.data));
    } else {
      store.dispatch(
        pushToCampStatementHistory(campStatementHistory.data.items || [])
      );
    }
    // debugger;
    return campStatementHistory?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getLiveHistoryApi = async (reqBody, historyOf) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const campStatementHistory = await NetworkCall.fetch(
      CampStatementHistoryRequest.getLiveHistory(reqBody, historyOf),
      false
    );
    store.dispatch(setHistory({ items: campStatementHistory.data }));
    return campStatementHistory.data;
  } catch (error) {
    return error;
  }
};

export const getCompareStatement = async (reqBody) => {
  try {
    const res = await NetworkCall.fetch(
      CampStatementHistoryRequest.statementCompare(reqBody),
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
      CampStatementHistoryRequest.commitChangeStatement(reqBody),
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
      CampStatementHistoryRequest.agreeToChange(reqBody),
      false
    );

    return res;
  } catch (error) {
    handleError(error);
    return error;
  }
};
