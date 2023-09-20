import loadingReducer, { setLoadingAction } from "../loading"; // Replace with the path to your slice file

describe("loadingSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      loading: false,
    };
  });

  it("should handle setLoadingAction", () => {
    const newState = loadingReducer(initialState, setLoadingAction(true));
    expect(newState.loading).toEqual(true);
  });


});
