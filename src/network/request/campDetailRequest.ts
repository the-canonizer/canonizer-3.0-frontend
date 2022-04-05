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

  static getNewsFeed(reqBody) {
    return new Request(
      K.Network.URL.GetNewsFeed,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCampStatement(reqBody) {
    return new Request(
      K.Network.URL.GetCampStatement,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCurrentTopicRecord(reqBody) {
    return new Request(
      K.Network.URL.GetCurrentTopicRecord,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getCurrentCampRecord(reqBody) {
    return new Request(
      K.Network.URL.GetCurrentCampRecord,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}
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
}
