import CurrentTopicCard from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
afterEach(cleanup);
windowMatchMedia();

describe("CurrentTopicCard on camp details page", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <CurrentTopicCard />
      </Provider>
    );
    expect(screen.getByText(/Topic Meta Information/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
  });
});
