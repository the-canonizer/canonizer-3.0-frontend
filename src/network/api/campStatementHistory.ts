import { handleError } from "../../utils/generalUtility";
import { store } from "../../store";
import {
  pushToCampStatementHistory,
  setCampStatementHistory,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import CampStatementHistoryRequest from "../request/campStatementHistoryRequest";

export const getCampStatementHistoryApi = async (reqBody, pageNumber) => {
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
    if (pageNumber == 1) {
      store.dispatch(setCampStatementHistory(campStatementHistory?.data));
    } else {
      store.dispatch(
        pushToCampStatementHistory(campStatementHistory?.data?.items || [])
      );
    }
    debugger;
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
