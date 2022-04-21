import K from "../../constants";
import Request from ".";
import { store } from "../../store";

const tokenBearer="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiODI2M2NmMjBlODVkMjRhY2EwOTk0MzZlMWNjMWNjNmRjMmE3NDE5YzM1OTIwN2E4ODg0YWY5OTNiNjA5NzI5Yjk4NTJhYzUwOTFmN2JlMjciLCJpYXQiOjE2NTA1MjUwMzEuMzA3MzE1LCJuYmYiOjE2NTA1MjUwMzEuMzA3MzE5LCJleHAiOjE2ODIwNjEwMzEuMjk3MjM2LCJzdWIiOiIxMjMwIiwic2NvcGVzIjpbIioiXX0.P83KeK4hvp63lgPMu64gCfMilA8TfkSWWumga7jZP59gXf3xSPi7MR1FR1M6S02oU52ElSdbkDKAHwgJGbE_siOw-VrYk-PZPJWhdUH5hYAswXSxRZ9aYB1dm6NHzDrTuyS33GKTIm1qQKnFwNGomL7BnuoTys2BU49YVZxVusyiSKRF_vXqDBb39HNsCUCGOO-ZFM3I1iYEVF3EXgg5cHyRTAasKMUFe3RcGk5xDnpls18NVazH4IX6tsQeMI-mqDxAv6XqJ3g-egLMb4kRZcr6b7TwtvXSFXPd4YPCoBQJbeBHpKuWn6QP3UlPXCszgLe4qZI00CKAzpK38V6EkvwHuG_Bflfc8aK8LF4v2Al_8gLal3rh92ZkArk8xu7-553s2ZkOloKRicLp7ckssFKzXuYS5P8RLiLKWrt9OkPAEE7w143W8vIzqKaYc-7g-xQPyrVrfvE2P6pAR7wE0SwlYvvP8pSeYsQEUZEKuHHyOrVnD-Cm8qjngUgYGL3cewSvVwfYOcXZFfN8rYECFsam-BAQ6T3p1inlbDTXVVgqnsrQFZ9oJU9R6Qu6k28WIVlA8eDfu_vQmpW-3mn2IMUoNiTvqxcQ3pt7mnMaL9BdrsjB-uTbkeFJwVn77jIi8WXrYLfM36ag9vDsZFpxmvdlORUxSKwfBefN5BRAadw"
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
      {},
      tokenBearer

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
