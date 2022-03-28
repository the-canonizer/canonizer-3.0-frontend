import CurrentTopicCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
afterEach(cleanup);
windowMatchMedia();

describe("CurrentTopicCard on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <CurrentTopicCard />
      </Provider>
    );
  });
});
