import NetworkCall from "../networkCall";
import { store } from "../../store";
import TagsRequests from "../request/tagsRequests";
import { setTags } from "src/store/slices/tagsSlice";

export const getAllTags = async (
  page = 1,
  per_page = 15,
  search_term = "",
  sort_by: "asc" | "desc" = "desc"
) => {
  try {
    const res = await NetworkCall.fetch(
      TagsRequests.getTags(page, per_page, search_term, sort_by),
      false
    );

    store.dispatch(setTags(res?.data?.items));

    return res?.data;
  } catch (error) {
    store.dispatch(setTags([]));
  }
};

export const savePrefTags = async (user_tags: any[]) => {
  try {
    const res = await NetworkCall.fetch(
      TagsRequests.saveCatsPref(user_tags),
      false
    );

    return res;
  } catch (error) {
    store.dispatch(setTags([]));
  }
};
