// forumSlice.test.js
import forumReducer, { setThread, setPost } from "../campForumSlice"; // Replace with the path to your slice file

describe("forumSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      currentThread: {},
      currentPost: {},
    };
  });

  it("should handle setThread", () => {
    const newThread = { id: 1, title: "Sample Thread" };
    const newState = forumReducer(initialState, setThread(newThread));
    expect(newState.currentThread).toEqual(newThread);
  });

  it("should handle setPost", () => {
    const newPost = { id: 1, content: "Sample Post Content" };
    const newState = forumReducer(initialState, setPost(newPost));
    expect(newState.currentPost).toEqual(newPost);
  });
});
