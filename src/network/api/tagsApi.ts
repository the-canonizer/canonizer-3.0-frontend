import NetworkCall from "../networkCall";
import { store } from "../../store";
import TagsRequests from "../request/tagsRequests";
import { setTags } from "src/store/slices/tagsSlice";

export const getAllTags = async (
  page = 1,
  per_page = 15,
  search_term = "",
  sort_by: "asc" | "desc" = "asc",
  token = ""
) => {
  const body: any = { search_term, sort_by };
  if (page) body.page = page;
  if (per_page) body.per_page = per_page;

  try {
    const res = await NetworkCall.fetch(
      TagsRequests.getTags(body, token),
      false
    );

    store.dispatch(setTags(res?.data?.items));

    return res;
  } catch (error) {
    store.dispatch(setTags([]));
    return error?.error?.data;
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
