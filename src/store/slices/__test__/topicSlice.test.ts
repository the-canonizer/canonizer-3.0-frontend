import topicReducer, { setCurrentTopic, resetCurrentTopic } from "../topicSlice"; // Replace with the path to your slice file

describe("topicSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      currentTopic: {
        topic_num: null,
        topic_name: "",
        camp_name: "Agreement",
        parent_camp_num: "1",
        message: null,
        submitter_nick_id: null,
      },
    };
  });

  it("should handle setCurrentTopic", () => {
    const topicPayload = {
      topic_num: 1,
      topic_name: "Topic 1",
      camp_name: "Camp 1",
      parent_camp_num: "1",
      message: "Hello",
      submitter_nick_id: "user1",
    };
    const newState = topicReducer(initialState, setCurrentTopic(topicPayload));
    expect(newState.currentTopic).toEqual(topicPayload);
  });

  it("should handle resetCurrentTopic", () => {
    const newState = topicReducer(initialState, resetCurrentTopic());
    expect(newState.currentTopic).toEqual(initialState.currentTopic);
  });
});
