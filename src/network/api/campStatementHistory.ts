import { store } from "src/store";
import { setCampStatementHistory } from "src/store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import CampStatementHistoryRequest from "../request/campStatementHistoryRequest";

export const getCampStatementHistoryApi = async (reqBody) => {
  try {
    const campStatementHistory = await NetworkCall.fetch(
      CampStatementHistoryRequest.statementHistory(reqBody)
    );
    store.dispatch(setCampStatementHistory(campStatementHistory?.data));
    return campStatementHistory;
  } catch (error) {
    // message.error(error.message);
  }
};
