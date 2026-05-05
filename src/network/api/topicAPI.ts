import NetworkCall from "../networkCall";
import TopicRequest from "../request/topicRequests";
import { handleError, getCookies } from "../../utils/generalUtility";
import { store } from "src/store";
import {
  setFeaturedTopic,
  setHotTopic,
  setPrefTopic,
  setConsensusVideoPodcasts,
} from "src/store/slices/hotTopicSlice";

export const createTopic = async (body) => {
  try {
    const res = await NetworkCall.fetch(TopicRequest.createTopic(body));
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};

export const GetActiveSupportTopic = async (body, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetActiveSupportTopic(body, loginToken)
    );

    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err.error?.data;
    }
  }
};

export const GetCheckSupportExists = async (reqbody, loginToken = null) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetCheckSupportExists(reqbody, loginToken)
    );
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.topic_name
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};

export const GetHotTopicDetails = async (page, perPage, token: string = "") => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetHotTopic(page, perPage, token)
    );

    if (res.status_code === 200) {
      store.dispatch(setHotTopic(res?.data?.items || []));
    }

    if (res.status_code === 400) {
      store.dispatch(setHotTopic([]));
    }

    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const GetPreferedTopicDetails = async (
  page = 1,
  perPage = 6,
  is_random = false,
  token?: string
) => {
  try {
    const res = await NetworkCall.fetch(
      TopicRequest.GetPreferedTopic(page, perPage, is_random, token)
    );

    if (res.status_code === 200) {
      store.dispatch(setPrefTopic(res?.data?.items || []));
    }

    if (res.status_code === 400) {
      store.dispatch(setPrefTopic([]));
    }

    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const GetFeaturedTopicDetails = async (token: string) => {
  try {
    const res = await NetworkCall.fetch(TopicRequest.GetFeaturedTopic(token));

    if (res.status_code === 200) {
      store.dispatch(setFeaturedTopic(res?.data?.items || []));
    }

    if (res.status_code === 400) {
      store.dispatch(setFeaturedTopic([]));
    }

    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const GetConsensusVideoPodcastDetails = async (page, perPage,token:string)=>{
  try {
      const res = await NetworkCall.fetch(TopicRequest.GetConsensusVideoPodcasts(page, perPage,token));

      if (res.status_code === 200) {
        store.dispatch(setConsensusVideoPodcasts(res?.data?.items || []));
      }

      if (res.status_code === 400) {
        store.dispatch(setConsensusVideoPodcasts([]));
      }

      return res;
    } catch (err) {
      return err?.error?.data;
    }
}

export const getTopicCategories = async () => {
  try {
    const cc: any = getCookies();
    const res = await NetworkCall.fetch(
      TopicRequest.GetTopicCategories(cc?.loginToken)
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const assignTopicCategory = async (body) => {
  try {
    const cc: any = getCookies();
    const res = await NetworkCall.fetch(
      TopicRequest.AssignTopicCategory(body, cc?.loginToken)
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const adminListTopics = async () => {
  try {
    const cc: any = getCookies();
    const res = await NetworkCall.fetch(
      TopicRequest.AdminTopicList(cc?.loginToken)
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};
