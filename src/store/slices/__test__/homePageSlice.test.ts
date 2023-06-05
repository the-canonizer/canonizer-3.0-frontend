import homePageReducer, {
  setCanonizedTopics,
  setCanonizedNameSpaces,
  setWhatsNewContent,
  pushToCanonizedTopics,
  setCanonizedAlgorithms,
} from "../homePageSlice"; // Replace with the path to your slice file

describe("homePageSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      canonizedTopicsData: {
        topics: [1],
        numOfPages: null,
      },
      nameSpaces: null,
      whatsNew: null,
      algorithms: null,
    };
  });

  it("should handle setCanonizedTopics", () => {
    const payload = {
      topic: [2, 3, 4],
      number_of_pages: 5,
    };
    const newState = homePageReducer(initialState, setCanonizedTopics(payload));
    expect(newState.canonizedTopicsData).toEqual({
      topics: [2, 3, 4],
      numOfPages: 5,
    });
  });

  it("should handle pushToCanonizedTopics", () => {
    const payload = {
      topic: [5, 6],
    };
    const newState = homePageReducer(initialState, pushToCanonizedTopics(payload));
    expect(newState.canonizedTopicsData).toEqual({
      topics: [1, 5, 6],
      numOfPages: null,
    });
  });

  it("should handle setCanonizedNameSpaces", () => {
    const payload = {
      data: ["namespace1", "namespace2"],
    };
    const newState = homePageReducer(initialState, setCanonizedNameSpaces(payload));
    expect(newState.nameSpaces).toEqual(["namespace1", "namespace2"]);
  });

  it("should handle setWhatsNewContent", () => {
    const payload = [
      {
        html_content: "<p>What's new content</p>",
      },
    ];
    const newState = homePageReducer(initialState, setWhatsNewContent(payload));
    expect(newState.whatsNew).toEqual("<p>What's new content</p>");
  });

  it("should handle setCanonizedAlgorithms", () => {
    const payload = {
      data: ["algorithm1", "algorithm2"],
    };
    const newState = homePageReducer(initialState, setCanonizedAlgorithms(payload));
    expect(newState.algorithms).toEqual(["algorithm1", "algorithm2"]);
  });
});
