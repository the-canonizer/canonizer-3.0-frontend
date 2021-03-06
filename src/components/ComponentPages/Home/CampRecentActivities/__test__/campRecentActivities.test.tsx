import CampRecentActivities from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

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
    const { container } = await render(<CampRecentActivities />);
    const userList = await waitFor(() =>
      screen.getByText(/no recent activity found/i)
    );
    expect(screen.getByText(/recent activities/i)).toBeInTheDocument();
    expect(userList).toBeInTheDocument();
  });
});
