import HelpCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

afterEach(cleanup);

describe("HelpCard on HomePage", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <HelpCard />
      </Provider>
    );
  });
});
