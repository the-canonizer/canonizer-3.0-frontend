import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import { setCampStatementHistory } from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import CampStatementHistoryRequest from "../request/campStatementHistoryRequest";

export const getCampStatementHistoryApi = async (reqBody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const campStatementHistory = await NetworkCall.fetch(
      CampStatementHistoryRequest.statementHistory(
        reqBody,
        auth.loggedInUser?.token
      ),
      false
    );
    store.dispatch(setCampStatementHistory(campStatementHistory?.data));
    return campStatementHistory?.data;
  } catch (error) {
    // message.error(error.message);
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
