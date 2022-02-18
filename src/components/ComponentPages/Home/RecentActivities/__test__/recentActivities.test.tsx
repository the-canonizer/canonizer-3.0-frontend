import RecentActivities from "../";
import { cleanup, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

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
    act(() => {
      const { container } = render(<RecentActivities />);
    });
  });
});
