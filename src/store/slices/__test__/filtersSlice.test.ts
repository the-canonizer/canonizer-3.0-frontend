import filtersReducer, {
  setFilterCanonizedTopics,
  setIsReviewCanonizedTopics,
  setCurrentCamp,
  setViewThisVersion,
  setCurrentDate,
} from "../filtersSlice"; // Replace with the path to your slice file

describe("filtersSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      filterObject: {
        page_number: 1,
        page_size: 15,
        nameSpace: "/General/",
        namespace_id: 1,
        asofdate: Date.now() / 1000,
        asof: "default",
        filterByScore: 0,
        algorithm: "blind_popularity",
        search: "",
        includeReview: false,
        // is_archive: 0,
      },
      selectedCampNode: null,
      current_date: new Date().valueOf(),
      viewThisVersionCheck: false,
    };
  });

  it("should handle setFilterCanonizedTopics", () => {
    const payload = {
      page_number: 2,
      page_size: 10,
      filterByScore: 1,
      search: "example",
    };
    const newState = filtersReducer(
      initialState,
      setFilterCanonizedTopics(payload)
    );
    expect(newState.filterObject).toEqual({
      ...initialState.filterObject,
      ...payload,
      includeReview: false,
    });
  });

  it("should handle setIsReviewCanonizedTopics", () => {
    const payload = {
      includeReview: true,
    };
    const newState = filtersReducer(
      initialState,
      setIsReviewCanonizedTopics(payload)
    );
    expect(newState.filterObject).toEqual({
      ...initialState.filterObject,
      ...payload,
    });
  });

  it("should handle setCurrentCamp", () => {
    const newState = filtersReducer(
      initialState,
      setCurrentCamp("your selected camp")
    );
    expect(newState.selectedCampNode).toEqual("your selected camp");
  });

  it("should handle setViewThisVersion", () => {
    const newState = filtersReducer(initialState, setViewThisVersion(true));
    expect(newState.viewThisVersionCheck).toEqual(true);
  });

  it("should handle setCurrentDate", () => {
    const newState = filtersReducer(
      initialState,
      setCurrentDate(1622275226000)
    );
    expect(newState.current_date).toEqual(1622275226000);
  });
});
