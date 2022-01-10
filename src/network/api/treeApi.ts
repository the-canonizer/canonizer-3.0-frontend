import { setTree } from "../../store/slices/treeSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/treeRequest";
import { message } from "antd";
import { store } from "../../store";

export const getTreesApi = async () => {
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees());
    store.dispatch(setTree(trees));
    return trees.data;
  } catch (error) {
    message.error(error.message);
  }
};
