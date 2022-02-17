import RecentActivities from "../";
import { cleanup, render } from "@testing-library/react";

afterEach(cleanup);

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", () => {
    render(<RecentActivities />);
  });
});
