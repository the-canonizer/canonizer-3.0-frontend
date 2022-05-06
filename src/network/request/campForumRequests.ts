import K from "../../constants";
import Request from ".";

export default class TreeRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.
  static createThread(body) {
    return new Request(
      K.Network.URL.ThreadCreate,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static updateThread(body, id) {
    return new Request(
      K.Network.URL.ThreadUpdate + "/" + id,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getThreads(queries) {
    return new Request(
      K.Network.URL.ThreadsList + queries,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static createPost(body) {
    return new Request(
      K.Network.URL.PostSave,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static updatePost(body, id) {
    return new Request(
      K.Network.URL.PostUpdate + "/" + id,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static getPosts(thread_id, queries) {
    return new Request(
      K.Network.URL.PostList + "/" + thread_id + queries,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static deletePost(id) {
    return new Request(
      K.Network.URL.PostDelete + "/" + id,
      K.Network.Method.DELETE,
      null,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
