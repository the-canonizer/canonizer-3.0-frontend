import campNewsReducer, { setCampNewsToEdit } from "../news"; // Replace with the path to your slice file

describe("campNewsSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      campNews: {
        newsToEdit: null,
      },
    };
  });

  it("should handle setCampNewsToEdit", () => {
    const newsToEdit = { id: 1, title: "News Title" };
    const newState = campNewsReducer(
      initialState,
      setCampNewsToEdit(newsToEdit)
    );
    expect(newState.campNews.newsToEdit).toEqual(newsToEdit);
  });

 
});
