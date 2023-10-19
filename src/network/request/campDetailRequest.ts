import K from "../../constants";
import Request from ".";
import { store } from "../../store";

export default class TreeRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static getTrees(reqBody) {
    return new Request(
      K.Network.URL.GetTree,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getNewsFeed(reqBody, token) {
    return new Request(
      K.Network.URL.GetNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getCampStatement(reqBody, token) {
    return new Request(
      K.Network.URL.GetCampStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getCurrentTopicRecord(reqBody, token) {
    return new Request(
      K.Network.URL.GetCurrentTopicRecord,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getCurrentCampRecord(reqBody, token) {
    return new Request(
      K.Network.URL.GetCurrentCampRecord,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getCampSupportingTree(reqBody) {
    return new Request(
      K.Network.URL.GetSupportingTree,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static createCamp(body) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.CreateCamp,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }

  static getAllParentsCamp(body) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.GetAllParents,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }

  static getAllCampNickNames() {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.GetCampNickNames,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }

  static getUsedNickNames(body) {
    let state = store.getState();
    const { auth } = state;

    return new Request(
      K.Network.URL.GetNickNames,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      auth.loggedInUser?.token
    );
  }

  static subscribeToCamp(reqBody, token) {
    return new Request(
      K.Network.URL.subscribeToCamp,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
  static getCampBreadCrumb(reqBody, token) {
    return new Request(
      K.Network.URL.GetCampBreadCrumb,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static getTopicActivityLog(reqBody, token) {
    return new Request(
      K.Network.URL.GetTopicActivityLog,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }

  static TotalScore(reqbody) {
    return new Request(
      K.Network.URL.TotalScore,
      K.Network.Method.POST,
      reqbody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static NickNamesSupported(id) {
    return new Request(
      K.Network.URL.GetNickSupportUser + id,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static removedReasons() {
    return new Request(
      K.Network.URL.GetRemovedReasons,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static checkTopicCampExistRequest(
    body: { topic_num: number; camp_num: number },
    token: string
  ) {
    return new Request(
      K.Network.URL.CheckTopicCampExist,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      token
    );
  }
}
