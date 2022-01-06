import { setTree } from "../../store/slices/treeSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/treeRequest";
import { message } from "antd";
import { store } from "../../store";

export const getTreesApi = async () => {
  console.log("getTreesApi////////called");
  try {
    const trees = await NetworkCall.fetch(TreeRequest.getTrees());
    // store.dispatch(setTree(trees));
    console.log("treeeeeees////////", trees);
    return trees.data;
  } catch (error) {
    console.log("treeeeeees////////error");
    message.error(error.message);
  }
};
