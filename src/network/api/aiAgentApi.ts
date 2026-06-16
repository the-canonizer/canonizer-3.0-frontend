import K from "../../constants";
import NetworkCall from "../networkCall";
import Request from "../request";

export const registerAiAgent = async (data) => {
  try {
    const res = await NetworkCall.fetch(
      new Request(
        K.Network.URL.RegisterUser,
        K.Network.Method.POST,
        data,
        K.Network.Header.Type.Json
      )
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const getAiAgentsList = async () => {
  try {
    const res = await NetworkCall.fetch(
      new Request(
        K.Network.URL.AiAgentsList,
        K.Network.Method.GET,
        {},
        K.Network.Header.Type.Json
      )
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const updateAiAgent = async (id, data) => {
  try {
    const res = await NetworkCall.fetch(
      new Request(
        `${K.Network.URL.AiAgentUpdate}/${id}`,
        K.Network.Method.PUT,
        data,
        K.Network.Header.Type.Json
      )
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};

export const deleteAiAgent = async (id) => {
  try {
    const res = await NetworkCall.fetch(
      new Request(
        `${K.Network.URL.AiAgentDelete}/${id}`,
        K.Network.Method.DELETE,
        {},
        K.Network.Header.Type.Json
      )
    );
    return res;
  } catch (err) {
    return err?.error?.data;
  }
};
