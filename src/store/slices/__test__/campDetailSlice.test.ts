import treeReducer, {
  setTree,
  setTopicName,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setHistory,
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
  pushToCampHistory,
  setCurrentCheckSupportStatus,
  setCheckSupportExistsData,
  setManageSupportStatusCheck,
  setManageSupportUrlLink,
  setRemovedReasons,
} from "../campDetailSlice"; // Replace with the path to your slice file

describe("treeSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      tree: null,
      newsFeed: null,
      campStatement: null,
      campSupportingTree: null,
      currentTopicRecord: null,
      currentCampRecord: null,
      topic_name: null,
      history: {
        items: [],
        details: {
          ifIamSupporter: null,
          ifSupportDelayed: null,
          ifIAmExplicitSupporter: null,
          topic: null,
          liveCamp: null,
        },
      },
      manageSupportStatusCheck: false,
      manageSupportUrlLink: null,
      CurrentCheckSupportStatus: null,
      currentGetCheckSupportExistsData: {
        camp_num: null,
        is_confirm: null,
        is_delegator: null,
        support_flag: null,
        topic_num: null,
        warning: null,
        remove_camps: [],
        message: null,
        disable_submit: null,
      },
      removedReasons: null,
    };
  });

  it("should handle setTree", () => {
    const newState = treeReducer(initialState, setTree("your tree value"));
    expect(newState.tree).toEqual("your tree value");
  });

  it("should handle setTopicName", () => {
    const newState = treeReducer(initialState, setTopicName("your topic name"));
    expect(newState.topic_name).toEqual("your topic name");
  });

  it("should handle setNewsFeed", () => {
    const newState = treeReducer(initialState, setNewsFeed("your news feed"));
    expect(newState.newsFeed).toEqual("your news feed");
  });

  it("should handle setCampStatement", () => {
    const newState = treeReducer(
      initialState,
      setCampStatement("your camp statement")
    );
    expect(newState.campStatement).toEqual("your camp statement");
  });

  it("should handle setCampSupportingTree", () => {
    const newState = treeReducer(
      initialState,
      setCampSupportingTree("your camp supporting tree")
    );
    expect(newState.campSupportingTree).toEqual("your camp supporting tree");
  });

  it("should handle pushToCampSupportingTree", () => {
    const currentState = { ...initialState, campSupportingTree: ["item1"] };
    const newState = treeReducer(
      currentState,
      pushToCampSupportingTree(["item2", "item3"])
    );
    expect(newState.campSupportingTree).toEqual(["item1", "item2", "item3"]);
  });

  it("should handle setCurrentTopicRecord", () => {
    const newState = treeReducer(
      initialState,
      setCurrentTopicRecord("your topic meta information")
    );
    expect(newState.currentTopicRecord).toEqual("your topic meta information");
  });

  it("should handle setCurrentCampRecord", () => {
    const newState = treeReducer(
      initialState,
      setCurrentCampRecord("your camp meta information")
    );
    expect(newState.currentCampRecord).toEqual("your camp meta information");
  });

  it("should handle setHistory", () => {
    const newState = treeReducer(initialState, setHistory("your history"));
    expect(newState.history).toEqual("your history");
  });

  it("should handle setCurrentTopicRecordSubscriptionId", () => {
    const currentState = { ...initialState, currentTopicRecord: {} };
    const newState = treeReducer(
      currentState,
      setCurrentTopicRecordSubscriptionId("your subscription ID")
    );
    expect(newState.currentTopicRecord.topicSubscriptionId).toEqual(
      "your subscription ID"
    );
  });

  it("should handle setCurrentCampRecordSubscriptionId", () => {
    const currentState = { ...initialState, currentCampRecord: {} };
    const newState = treeReducer(
      currentState,
      setCurrentCampRecordSubscriptionId("your subscription ID")
    );
    expect(newState.currentCampRecord.subscriptionId).toEqual(
      "your subscription ID"
    );
  });

  it("should handle pushToCampHistory", () => {
    const currentState = { ...initialState, history: { items: ["item1"] } };
    const newState = treeReducer(
      currentState,
      pushToCampHistory(["item2", "item3"])
    );
    expect(newState.history.items).toEqual(["item1", "item2", "item3"]);
  });

  it("should handle setCurrentCheckSupportStatus", () => {
    const newState = treeReducer(
      initialState,
      setCurrentCheckSupportStatus("your support status")
    );
    expect(newState.CurrentCheckSupportStatus).toEqual("your support status");
  });

  it("should handle setCheckSupportExistsData", () => {
    const payload = {
      camp_num: 123,
      is_confirm: true,
      is_delegator: false,
      support_flag: true,
      topic_num: 456,
      warning: "Some warning",
      remove_camps: [],
      message: "Some message",
      disable_submit: false,
    };
    const newState = treeReducer(
      initialState,
      setCheckSupportExistsData(payload)
    );
    expect(newState.currentGetCheckSupportExistsData).toEqual(payload);
  });

  it("should handle setManageSupportStatusCheck", () => {
    const newState = treeReducer(
      initialState,
      setManageSupportStatusCheck(true)
    );
    expect(newState.manageSupportStatusCheck).toEqual(true);
  });

  it("should handle setManageSupportUrlLink", () => {
    const newState = treeReducer(
      initialState,
      setManageSupportUrlLink("your URL link")
    );
    expect(newState.manageSupportUrlLink).toEqual("your URL link");
  });

  it("should handle setRemovedReasons", () => {
    const newState = treeReducer(
      initialState,
      setRemovedReasons("your removed reasons")
    );
    expect(newState.removedReasons).toEqual("your removed reasons");
  });
});
