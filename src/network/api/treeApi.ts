import { setTree } from "../../store/slices/treeSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/treeRequest";
import { message } from "antd";

export const getTreesApi = (dispatch) => async () => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees());
    dispatch(setTree(trees));
    return trees?.data;
  } catch (error) {
    message.error(error.message);
  }
};
