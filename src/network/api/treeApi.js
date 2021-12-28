import { setTree } from "../../store/slices/treeSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/treeRequest";

export const getTreesApi = async (dispatch) => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees());
    dispatch(setTree(trees));
    return trees;
  } catch (error) {
    message.error(error.message);
  }
};
