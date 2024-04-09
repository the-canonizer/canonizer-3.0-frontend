import CurrentCampCard from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
afterEach(cleanup);
windowMatchMedia();
describe("Camp tree card on camp details page", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <CurrentCampCard />
      </Provider>
    );
    expect(screen.getByText(/Camp Meta Information/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
  });
});
