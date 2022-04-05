import CampTreeCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

afterEach(cleanup);

describe("Camp tree card on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <CampTreeCard />
      </Provider>
    );
  });
});
