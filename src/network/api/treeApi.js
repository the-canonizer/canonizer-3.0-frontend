import { setTree } from "../../store/slices/treeSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/treeRequest";
import { store } from "../../store";

export const getTreesApi = async () => {
  debugger;
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees());
    store.dispatch(setTree(trees));
    return user;
  } catch (error) {
    debugger;
    // message.error(error.message);
  }
};
