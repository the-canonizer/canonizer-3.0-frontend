import CampRecentActivities from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

import { store } from "../../../../../store";
import { Provider } from "react-redux";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

afterEach(cleanup);
describe("Should render Addnews", () => {
  it("Render without crash", async () => {
    await render(
      <Provider store={store}>
        <CampRecentActivities />
      </Provider>
    );
    const userList = await waitFor(() =>
      screen.getByText(/No Recent Activity Found/i)
    );
    expect(screen.getByText(/recent activities/i)).toBeInTheDocument();
    expect(userList).toBeInTheDocument();
  });
});
